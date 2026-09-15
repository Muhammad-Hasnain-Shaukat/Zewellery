import os
import subprocess
from PIL import Image

FFMPEG = r"C:\Users\Doctor Computers\AppData\Local\Programs\Python\Python312\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_DIR = os.path.join(BASE_DIR, "public")
VIDEOS_DIR = os.path.join(PUBLIC_DIR, "videos")
IMAGES_DIR = os.path.join(PUBLIC_DIR, "images")

def optimize_video():
    raw_video = os.path.join(VIDEOS_DIR, "hero.mp4")
    temp_mp4 = os.path.join(VIDEOS_DIR, "hero_opt.mp4")
    out_webm = os.path.join(VIDEOS_DIR, "hero.webm")
    poster_jpg = os.path.join(IMAGES_DIR, "hero-poster.jpg")
    poster_webp = os.path.join(IMAGES_DIR, "hero-poster.webp")

    print("=== 1. Extracting Hero Poster Frames ===")
    # Extract first frame
    cmd_poster = [
        FFMPEG, "-y",
        "-ss", "00:00:00.000",
        "-i", raw_video,
        "-vframes", "1",
        "-q:v", "2",
        poster_jpg
    ]
    subprocess.run(cmd_poster, check=True)
    
    # Create WebP poster as well
    with Image.open(poster_jpg) as img:
        img = img.resize((1920, 1080), Image.Resampling.LANCZOS)
        img.save(poster_webp, "WEBP", quality=85, method=6)
        img.save(poster_jpg, "JPEG", quality=85, optimize=True, progressive=True)
    print(f"Created poster: {os.path.getsize(poster_webp)/1024:.1f} KB (webp)")

    print("=== 2. Encoding Optimized MP4 (1080p, H.264, +faststart, no audio) ===")
    cmd_mp4 = [
        FFMPEG, "-y",
        "-i", raw_video,
        "-vf", "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2",
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "24",
        "-an",
        "-movflags", "+faststart",
        temp_mp4
    ]
    subprocess.run(cmd_mp4, check=True)
    mp4_sz = os.path.getsize(temp_mp4)
    print(f"Optimized MP4 size: {mp4_sz/(1024*1024):.2f} MB")

    print("=== 3. Encoding Optimized WebM (1080p, VP9, no audio) ===")
    cmd_webm = [
        FFMPEG, "-y",
        "-i", temp_mp4,
        "-c:v", "libvpx-vp9",
        "-crf", "32",
        "-b:v", "0",
        "-deadline", "good",
        "-cpu-used", "3",
        "-an",
        out_webm
    ]
    subprocess.run(cmd_webm, check=True)
    webm_sz = os.path.getsize(out_webm)
    print(f"Optimized WebM size: {webm_sz/(1024*1024):.2f} MB")

    # Replace hero.mp4 with optimized version
    os.replace(temp_mp4, raw_video)
    print("Replaced public/videos/hero.mp4 with optimized version.")

def optimize_images():
    print("=== 4. Optimizing All Project Images ===")
    initial_total = 0
    final_total = 0

    for root, _, files in os.walk(IMAGES_DIR):
        for fname in files:
            ext = os.path.splitext(fname)[1].lower()
            if ext not in [".jpg", ".jpeg", ".png"]:
                continue
            
            fpath = os.path.join(root, fname)
            orig_size = os.path.getsize(fpath)
            initial_total += orig_size

            try:
                with Image.open(fpath) as img:
                    orig_format = img.format
                    orig_mode = img.mode

                    # Also save WebP version alongside
                    webp_path = os.path.splitext(fpath)[0] + ".webp"

                    # Max dimension for web: 1920px (downscale oversized images while keeping crispness)
                    w, h = img.size
                    max_dim = 1920
                    if max(w, h) > max_dim:
                        scale = max_dim / max(w, h)
                        new_w, new_h = int(w * scale), int(h * scale)
                        img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

                    if ext in [".jpg", ".jpeg"]:
                        if img.mode != "RGB":
                            img = img.convert("RGB")
                        # Optimize JPG in-place
                        img.save(fpath, "JPEG", quality=82, optimize=True, progressive=True)
                        # WebP
                        img.save(webp_path, "WEBP", quality=80, method=5)

                    elif ext == ".png":
                        # For logos and emblems, preserve transparency
                        if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
                            # Quantize palette for transparent PNGs if large
                            # Convert to RGBA
                            rgba = img.convert("RGBA")
                            # Quantize with alpha to 256 colors for dramatic size reduction without visible loss
                            quantized = rgba.quantize(colors=256, method=Image.Quantize.FASTOCTREE)
                            quantized.save(fpath, "PNG", optimize=True)
                            rgba.save(webp_path, "WEBP", quality=90, method=6)
                        else:
                            img.save(fpath, "PNG", optimize=True)
                            img.save(webp_path, "WEBP", quality=85, method=6)

                new_size = os.path.getsize(fpath)
                final_total += new_size
                print(f"Optimized {fname}: {orig_size/1024:.1f} KB -> {new_size/1024:.1f} KB (saved {((orig_size-new_size)/orig_size)*100:.1f}%)")
            except Exception as err:
                print(f"Error optimizing {fname}: {err}")
                final_total += orig_size

    print(f"\nInitial images size: {initial_total/(1024*1024):.2f} MB")
    print(f"Optimized images size: {final_total/(1024*1024):.2f} MB")
    print(f"Total space saved on images: {(initial_total - final_total)/(1024*1024):.2f} MB")

if __name__ == "__main__":
    optimize_video()
    optimize_images()
    print("ALL OPTIMIZATION COMPLETED SUCCESSFULLY!")

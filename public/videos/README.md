# Create videos directory
mkdir -p public/videos

# If you have ffmpeg installed, create placeholder videos
ffmpeg -f lavfi -i color=c=black:s=1280x720 -t 3 public/videos/intro.mp4
ffmpeg -f lavfi -i color=c=blue:s=1280x720 -t 2 public/videos/round-start.mp4
ffmpeg -f lavfi -i color=c=red:s=1280x720 -t 2 public/videos/round-end.mp4
ffmpeg -f lavfi -i color=c=green:s=1280x720 -t 3 public/videos/victory.mp4
ffmpeg -f lavfi -i color=c=purple:s=1280x720 -t 3 public/videos/defeat.mp4


## Optimize move for web
ffmpeg -i input.mov \
    -c:v libx264 \
    -preset medium \
    -crf 23 \
    -vf "scale=1920:1080" \
    -movflags +faststart \
    -c:a aac \
    -b:a 128k \
    output.mp4

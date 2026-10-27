Add-Type -AssemblyName System.Drawing

$sourceDir = Join-Path $PSScriptRoot "..\public\imgs"
$outputFile = Join-Path $PSScriptRoot "..\public\netflix-login-bg.jpg"

$files = Get-ChildItem "$sourceDir\*.jpeg"
if ($files.Count -eq 0) {
    Write-Error "No images found in $sourceDir"
    exit 1
}

Write-Host "Found $($files.Count) images. Generating HD Netflix-style background..."

# Canvas Dimensions (Ultra HD 2560x1440)
$canvasWidth = 2560
$canvasHeight = 1440
$bitmap = New-Object System.Drawing.Bitmap($canvasWidth, $canvasHeight)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)

# Set high-quality rendering
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

# Fill dark background
$bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 15, 15, 15))
$graphics.FillRectangle($bgBrush, 0, 0, $canvasWidth, $canvasHeight)
$bgBrush.Dispose()

# Grid parameters (angled Netflix poster wall)
# We will draw a rotated grid of movie posters
$angle = -11.0 # Netflix angle
$posterWidth = 260
$posterHeight = 380
$gapX = 22
$gapY = 22
$radius = 12

# Rotate around center
$graphics.TranslateTransform($canvasWidth / 2, $canvasHeight / 2)
$graphics.RotateTransform($angle)
$graphics.TranslateTransform(-($canvasWidth / 2), -($canvasHeight / 2))

# We need a large virtual area to cover the 2560x1440 canvas when rotated
$startX = -500
$endX = $canvasWidth + 600
$startY = -600
$endY = $canvasHeight + 700

$col = 0
$row = 0
$imgIndex = 0

# Cache loaded images
$loadedImages = @()
foreach ($file in $files) {
    try {
        $img = [System.Drawing.Image]::FromFile($file.FullName)
        $loadedImages += $img
    } catch {
        Write-Warning "Could not load $($file.FullName)"
    }
}

if ($loadedImages.Count -eq 0) {
    Write-Error "No valid images could be loaded"
    exit 1
}

# Create a rounded rectangle path helper function
function DrawRoundedPoster($g, $image, $x, $y, $w, $h, $r) {
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $r * 2
    $path.AddArc($x, $y, $d, $d, 180, 90)
    $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
    $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
    $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
    $path.CloseFigure()

    $state = $g.Save()
    $g.SetClip($path)

    # Crop & cover image into poster area
    $srcW = $image.Width
    $srcH = $image.Height
    $targetAspect = [double]$w / [double]$h
    $srcAspect = [double]$srcW / [double]$srcH

    if ($srcAspect -gt $targetAspect) {
        # Image is wider than poster, crop sides
        $cropW = [int]($srcH * $targetAspect)
        $cropH = $srcH
        $cropX = [int](($srcW - $cropW) / 2)
        $cropY = 0
    } else {
        # Image is taller than poster, crop top/bottom
        $cropW = $srcW
        $cropH = [int]($srcW / $targetAspect)
        $cropX = 0
        $cropY = [int](($srcH - $cropH) / 4) # bias slightly upwards
    }

    $destRect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $g.DrawImage($image, $destRect, $cropX, $cropY, $cropW, $cropH, [System.Drawing.GraphicsUnit]::Pixel)

    # Subtle inner border for poster definition
    $g.Restore($state)
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(40, 255, 255, 255), 1.5)
    $g.DrawPath($pen, $path)
    $pen.Dispose()
    $path.Dispose()
}

$y = $startY
$rowIdx = 0
while ($y -lt $endY) {
    # Stagger alternating rows slightly like Netflix
    $xOffset = if ($rowIdx % 2 -eq 1) { -($posterWidth / 2) } else { 0 }
    $x = $startX + $xOffset

    while ($x -lt $endX) {
        $curImg = $loadedImages[$imgIndex % $loadedImages.Count]
        DrawRoundedPoster $graphics $curImg $x $y $posterWidth $posterHeight $radius

        $imgIndex++
        $x += ($posterWidth + $gapX)
    }
    $y += ($posterHeight + $gapY)
    $rowIdx++
}

# Reset transform
$graphics.ResetTransform()

# Save JPEG with 95% quality
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatDescription -eq "JPEG" }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]95)

$bitmap.Save($outputFile, $encoder, $encoderParams)

# Cleanup
$graphics.Dispose()
$bitmap.Dispose()
foreach ($img in $loadedImages) {
    $img.Dispose()
}

Write-Host "Successfully generated HD Netflix-style background at: $outputFile"

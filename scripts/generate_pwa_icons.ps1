param(
    [string]$OutputDirectory = (Join-Path $PSScriptRoot '..\android-app\app\src\main\assets\www\icons')
)

Add-Type -AssemblyName System.Drawing

function New-PsyEticaIcon {
    param(
        [int]$Size,
        [double]$ContentScale,
        [string]$Path
    )

    $bitmap = [System.Drawing.Bitmap]::new($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $background = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#176B68'))
    $cream = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#FFF7E6'))
    $accent = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#FFC857'))
    $body = [System.Drawing.Drawing2D.GraphicsPath]::new()

    try {
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graphics.FillRectangle($background, 0, 0, $Size, $Size)

        $scale = ($Size / 108.0) * $ContentScale
        $offset = ($Size - (108 * $scale)) / 2.0
        $graphics.TranslateTransform([single]$offset, [single]$offset)
        $graphics.ScaleTransform([single]$scale, [single]$scale)

        $graphics.FillEllipse($cream, 43, 18, 22, 22)
        $graphics.FillEllipse($cream, 21, 30, 18, 18)
        $graphics.FillEllipse($cream, 69, 30, 18, 18)

        $body.StartFigure()
        $body.AddLine(25, 49, 35, 49)
        $body.AddLine(35, 49, 35, 57)
        $body.AddBezier(35, 57, 35, 66, 41, 71, 49, 72)
        $body.AddLine(49, 72, 49, 48)
        $body.AddLine(49, 48, 59, 48)
        $body.AddLine(59, 48, 59, 72)
        $body.AddBezier(59, 72, 67, 71, 73, 66, 73, 57)
        $body.AddLine(73, 57, 73, 49)
        $body.AddLine(73, 49, 83, 49)
        $body.AddLine(83, 49, 83, 58)
        $body.AddBezier(83, 58, 83, 71, 73, 80, 59, 82)
        $body.AddLine(59, 82, 59, 91)
        $body.AddLine(59, 91, 49, 91)
        $body.AddLine(49, 91, 49, 82)
        $body.AddBezier(49, 82, 35, 80, 25, 71, 25, 58)
        $body.CloseFigure()
        $graphics.FillPath($cream, $body)
        $graphics.FillRectangle($accent, 44, 93, 20, 5)

        $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    }
    finally {
        $body.Dispose()
        $accent.Dispose()
        $cream.Dispose()
        $background.Dispose()
        $graphics.Dispose()
        $bitmap.Dispose()
    }
}

$resolvedOutput = [System.IO.Path]::GetFullPath($OutputDirectory)
New-Item -ItemType Directory -Path $resolvedOutput -Force | Out-Null

New-PsyEticaIcon -Size 32 -ContentScale 0.88 -Path (Join-Path $resolvedOutput 'favicon-32.png')
New-PsyEticaIcon -Size 180 -ContentScale 0.88 -Path (Join-Path $resolvedOutput 'apple-touch-icon.png')
New-PsyEticaIcon -Size 192 -ContentScale 0.88 -Path (Join-Path $resolvedOutput 'icon-192.png')
New-PsyEticaIcon -Size 512 -ContentScale 0.88 -Path (Join-Path $resolvedOutput 'icon-512.png')
New-PsyEticaIcon -Size 512 -ContentScale 0.64 -Path (Join-Path $resolvedOutput 'icon-maskable-512.png')

Write-Output "Generated PsyEtica PWA icons in $resolvedOutput"

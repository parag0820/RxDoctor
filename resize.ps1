Add-Type -AssemblyName System.Drawing
$image = [System.Drawing.Image]::FromFile('C:\Users\admin\.gemini\antigravity-ide\brain\3960532b-2fb7-4d92-a489-020cd0726fe7\default_patient_avatar_1788354922256.jpg')
$bmp = New-Object System.Drawing.Bitmap(150, 150)
$graph = [System.Drawing.Graphics]::FromImage($bmp)
$graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graph.DrawImage($image, 0, 0, 150, 150)
$bmp.Save('c:\RxDoctor\src\assets\default_patient.png', [System.Drawing.Imaging.ImageFormat]::Png)
$graph.Dispose()
$bmp.Dispose()
$image.Dispose()

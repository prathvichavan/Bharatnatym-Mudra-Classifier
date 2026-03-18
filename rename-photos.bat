@echo off
setlocal enabledelayedexpansion

set "source=C:\Users\Acer\Desktop\Mudra Dataset\mudra-vision-main\public\team"

if exist "!source!\prathviraj chavan.jpg" (
    ren "!source!\prathviraj chavan.jpg" "prathviraj-chavan.jpg"
    echo Renamed prathviraj chavan.jpg
)

if exist "!source!\pooja choudhary.png" (
    ren "!source!\pooja choudhary.png" "pooja-choudhary.png"
    echo Renamed pooja choudhary.png
)

if exist "!source!\shubi upadhyay.jpeg" (
    ren "!source!\shubi upadhyay.jpeg" "shubhi-upadhyay.jpeg"
    echo Renamed shubi upadhyay.jpeg
)

if exist "!source!\saniya devarsi.jpeg" (
    ren "!source!\saniya devarsi.jpeg" "saniya-devarshi.jpeg"
    echo Renamed saniya devarsi.jpeg
)

echo All photos renamed successfully!
pause

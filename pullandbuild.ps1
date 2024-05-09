$pullResult = git pull
$hasPulled = $false

$pullResult | ForEach-Object { if($_.Contains("files changed")){$hasPulled=$true;return}}

if($hasPulled){npm run build}
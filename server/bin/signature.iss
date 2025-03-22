[Setup]
AppName=YouTube Downloader
AppVersion=1.0
DefaultDirName={pf}\YouTubeDownloader
DefaultGroupName=YouTube Downloader
OutputDir=.
OutputBaseFilename=YouTubeDownloaderInstaller
Compression=lzma
SolidCompression=yes

[Files]
Source: "..\bin\youtube-downloader.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\lib\yt-dlp.exe"; DestDir: "{app}\lib"; Flags: ignoreversion

[Icons]
Name: "{group}\YouTube Downloader"; Filename: "{app}\youtube-downloader.exe"

[Run]
Filename: "{app}\youtube-downloader.exe"; Description: "Launch YouTube Downloader"; Flags: nowait postinstall

[Code]
procedure CurStepChanged(CurStep: TSetupStep);
var
  ResultCode: Integer;
begin
  if CurStep = ssPostInstall then
  begin
    Exec(ExpandConstant('{app}\youtube-downloader.exe'), '', '', SW_HIDE, ewNoWait, ResultCode);
  end;
end;

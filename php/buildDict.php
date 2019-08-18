<body>
<?php

$d = array();
function parse_file($filename)
{
    try {
        $file = new SplFileObject($filename);
    } catch (LogicException $exception) {
        die('SplFileObject : '.$exception->getMessage());
    }
    while ($file->valid()) {
        $line = strtolower(trim($file->fgets()));
        if (strlen($line) >= 3) {
            $prefix = substr($line,0,1);
            if (!isset($d[$prefix])) {
                $d[$prefix] = [];
            }
            if (!isset($d[$prefix][strlen($line)-1])) {
                $d[$prefix][strlen($line)-1] = "";
            }
            $d[$prefix][strlen($line)-1] .= substr($line, 1);
        }   
    }
    $file = null;

    $outfile = fopen("dict.json", "w");
    fwrite($outfile, json_encode($d));
    $outfile = null;
}
?>

<code style = "overflow-wrap: break-word;">

<?php
if (!file_exists("dict.json")) {
    parse_file("dict.txt");
}
// $infile = fopen("dict.json", "r");
echo file_get_contents("dict.json");
// echo fread($infile);
// $infile = null;
?>

</code>

</body>
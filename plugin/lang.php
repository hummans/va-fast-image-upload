<?php
/**
 * Coded By : aigenseer
 * Copyright 2019, https://github.com/aigenseer
 */
global $fiu_pluginsettings;
$fiu_pluginsettings->fetchPost('lang');
$formvalues = $fiu_pluginsettings->getAll('lang');
require 'pluginsettingsform.php';
?>

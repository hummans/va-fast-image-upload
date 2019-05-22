<?php
/**
 * Coded By : aigenseer
 * Copyright 2019, https://github.com/aigenseer
 */
global $fiu_pluginsettings;
$fiu_pluginsettings->fetchPost('settings');
$formvalues = $fiu_pluginsettings->getAll('settings');
require 'pluginsettingsform.php';
 ?>

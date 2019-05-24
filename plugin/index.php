<?php
 /*
   Plugin Name: VA-Fast-Image-Upload
   Plugin URI: https://github.com/aigenseer
   description: A simple upload image user interface with browser camera support
   Version: 1.0.0
   Author: Viktor Aigenseer
   Author URI: https://github.com/aigenseer/va-fast-image-upload
 */
define('FIU_PLUGIN_FILE_URL', dirname( __FILE__ , 1 ));
define('FIU_PLUGIN_URL', plugins_url('/va-fast-image-upload/plugin'));
define('FIU_NAME', 'VA Fast Image Upload');
define('FIU_PREFIX', 'vafastimageupload');
define('FIU_API_VERSION', 'v1');
define('FIU_SHORTCODE_NAME', 'va-fast-image-upload');
define('FIU_SHORTCODE_NAME_SCRIPT_PATH',  plugins_url( '/assets/va-fast-image-upload.js', __FILE__ ));
$wp_rewrite = new wp_rewrite;

include "sql/uploadtable.class.php";
$fiu_upload = new FIU_UploadTable(FIU_PREFIX);
$fiu_upload->createTable();

include "class/tabs.class.php";
$fiu_tabs = new FIU_Tabs(FIU_PREFIX, FIU_NAME, [
  'uploads' => (object)[
    'title' => 'Upload Images',
    'include' => FIU_PLUGIN_FILE_URL.'/list.php'
  ],
  'settings' => (object)[
    'title' => 'Settings',
    'include' => FIU_PLUGIN_FILE_URL.'/settings.php'
  ],
  'lang' => (object)[
    'title' => 'Language',
    'include' => FIU_PLUGIN_FILE_URL.'/lang.php'
  ],
]);

include "sql/pluginsettings.class.php";
$fiu_pluginsettings = new FIU_PluginSettings(FIU_PREFIX, (object)[
  'settings' => (object)[
    'uploadUrl' => (object)[
      'title' => 'Upload URL',
      'type' => 'string',
      'defaultvalue' => get_rest_url().FIU_PREFIX."/".FIU_API_VERSION."/upload/%FINGERPRINT",
      'placeholder' => 'wordpress-upload',
      'description' => 'url path to upload the file. (The fingerprint id can be set with %FINGERPRINT)',
      'validate' => function ($raw){
        $url = sanitize_text_field($raw);
        if (filter_var($url, FILTER_VALIDATE_URL)) {
          return esc_url($url, ['http', 'https']);
        }else{
          return '';
        }
      }
    ],
    'maxFingerprintUpload' => (object)[
      'title' => 'Max upload per day',
      'type' => 'number',
      'defaultvalue' => 5,
      'minvalue' => 1,
      'maxvalue' => 999,
      'description' => 'Max upload per fingerprint at day.',
      'private' => true
    ],
    'disableTakePhoto' => (object)[
      'title' => 'Disable take photo',
      'type' => 'boolean',
      'defaultvalue' => 0,
      'description' => 'User can not use the browser camera to take a photo.'
    ],
    'disableButton' => (object)[
      'title' => 'Diable button',
      'type' => 'boolean',
      'defaultvalue' => 0,
      'description' => 'if you disable the button, you can open the dialog with the class name "shortcodesendimage-open".'
    ]
  ],
  'lang' => (object)[
    'choiceTitle' => (object)[
      'title' => 'Choice title',
      'type' => 'string',
      'defaultvalue' => 'Choice the upload option'
    ],
    'takeFoto' => (object)[
      'title' => 'Take a picture',
      'type' => 'string',
      'defaultvalue' => 'Take a picture'
    ],
    'sendFoto' => (object)[
      'title' => 'Send picture',
      'type' => 'string',
      'defaultvalue' => 'Send a picture'
    ],
    'sendData' => (object)[
      'title' => 'Data is sent',
      'type' => 'string',
      'defaultvalue' => 'Data is sent'
    ],
    'screenButtonTitle' => (object)[
      'title' => 'Title for screen button',
      'type' => 'string',
      'defaultvalue' => 'Send Foto'
    ],
    'titleSelectDevice' => (object)[
      'title' => 'Title for choose the device camera',
      'type' => 'string',
      'defaultvalue' => 'Select device'
    ],
    'titleWaitPermission' => (object)[
      'title' => 'Title for wait permission',
      'type' => 'string',
      'defaultvalue' => 'Wait for your permission'
    ],
    'titlePermissonFailed' => (object)[
      'title' => 'Title for permission failed',
      'type' => 'string',
      'defaultvalue' => 'Permission failed'
    ],
    'contentPermissonFailed' => (object)[
      'title' => 'Content for permission failed',
      'type' => 'long-string',
      'defaultvalue' => 'Your browser has no permission for the camera. Please activate the permission.',
      'placeholder' => 'Your browser has no permission for the camera. Please activate the permission.'
    ]
  ]
]);
$fiu_pluginsettings->createTable();


include "class/uploadlist.class.php";
$fiu_uploadlist = new FIU_UploadList();
$fiu_uploadlist->process_bulk_action();

function fiu_init_menu() {
    add_menu_page(FIU_NAME, FIU_NAME, "manage_options", FIU_PREFIX, "fiu_display", FIU_PLUGIN_URL.'/img/icon.png');
}
add_action("admin_menu", "fiu_init_menu");

function fiu_display(){
  global $fiu_tabs;
	$fiu_tabs->display();
}

include "shortcode.php";

<?php
/**
 * [handling function for the rest route
 *  saves the uploaded files in the db and wordpress upload files]
 * @param  stdObject $data
 */
function fiu_rest_api_upload($data)
{
  global $fiu_pluginsettings;
  if(!array_key_exists(FIU_PREFIX, $_FILES)){
    return new WP_Error('No File send', sprintf('Can not find file with name %s', FIU_PREFIX), array('status' => 400));
  }
  if(strpos($_FILES[FIU_PREFIX]['type'], 'image')===false){
    return new WP_Error('No Image', sprintf('File %s is no image', $_FILES[FIU_PREFIX]['name']), array('status' => 400));
  }
  if($_FILES[FIU_PREFIX]['size']==0){
    return new WP_Error('No Image', sprintf('File %s size is zero', $_FILES[FIU_PREFIX]['name']), array('status' => 400));
  }
  $maxFingerprintUpload = $fiu_pluginsettings->getAll('settings')->maxFingerprintUpload->value;
  $fingerprint = $data->get_param('id');

  $responseData = (object)[];
  $status = 200;
  $upload = new FIU_UploadTable(FIU_PREFIX);

  if(intval($upload->getCountFingerprint($fingerprint)) >= intval($maxFingerprintUpload)){
    return new WP_Error('Max uploads per day', 'Unfortunately, you have reached your maximum number of uploads. Try it again tomorrow.', array('status' => 406));
  }

  if ( ! function_exists( 'wp_handle_upload' ) ) {
    require_once( ABSPATH . 'wp-admin/includes/file.php' );
  }
  try {
      $upload_overrides = array( 'test_form' => false );
      $movefile = wp_handle_sideload( $_FILES[FIU_PREFIX], $upload_overrides );
  } catch (\Exception $e) {
      return new WP_Error('Unkown Error', $e->message, array('status' => 400));
  }
  
  if ( $movefile && ! isset( $movefile['error'] ) ) {
      $upload = new FIU_UploadTable(FIU_PREFIX);
      $upload->add($data->get_param('id'), $movefile["file"], $movefile["url"]);
      $responseData->status = 'success';
  } else {
      return new WP_Error('Unkown Error', $movefile['error'], array('status' => 400));
  }

  $response = new WP_REST_Response( $responseData );
  $response->set_status( $status );

  return $response;
}

/**
 * registered the rest api url path
 */
add_action( 'rest_api_init', function () {
  register_rest_route(FIU_PREFIX."/".FIU_API_VERSION, '/upload/(?P<id>[a-zA-Z0-9-]+)', array(
    'methods' => 'POST',
    'callback' => 'fiu_rest_api_upload',
  ));
});



/**
 * [deliver the html content for the shortcode]
 * @return String
 */
function fiu_shortcodeHTML(){
  global $fiu_pluginsettings;
  $id = FIU_PREFIX;

  $lang = json_encode($fiu_pluginsettings->getAll('lang', true));
  $settings = json_encode($fiu_pluginsettings->getAll('settings', true));

  return <<<HTML
    <div id="{$id}" />
    <script type="application/javascript" >
      window.{$id} = {
        lang: $lang,
        settings: $settings
      }
    </script>
HTML;
}


/**
 * [initialize the shortcode]
 * @return [type] [description]
 */
function fiu_init_cc() {
  wp_enqueue_script(FIU_SHORTCODE_NAME.'-script', FIU_SHORTCODE_NAME_SCRIPT_PATH);
  return fiu_shortcodeHTML();
}
add_shortcode(FIU_SHORTCODE_NAME, 'fiu_init_cc');
?>

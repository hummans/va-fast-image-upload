<div id="wpbody-content">
  <form method='post' action=''>
    <table class="form-table">
<?php

/**
 * [deliver the description p tag]
 * @param  stdobject $entry
 * @return String
 */
function qsr_printDescription($entry)
{
  if(property_exists($entry, 'description')){
    return <<<HTML
    <p class="description">$entry->description</p>
HTML;
  }
}
$printDescription = 'qsr_printDescription';

foreach ($formvalues as $name => $entry){
  print <<<HTML
    <tr>
      <th scope="row"><label for="name">$entry->title</label></th>
HTML;
  switch ($entry->type) {
    case 'string':
      print <<<HTML
        <td>
          <input type='text' name='$name' value='$entry->value' placeholder='$entry->placeholder' />
          {$printDescription($entry)}
        </td>
HTML;
      break;
      case 'long-string':
        print <<<HTML
          <td>
            <textarea name="$name" class="regular-text" placeholder='$entry->placeholder' rows="3">$entry->value</textarea>
            {$printDescription($entry)}
          </td>
HTML;
      break;
      case 'number':
        print <<<HTML
          <td>
            <input name='$name' type="number" value='$entry->value' min='$entry->minvalue' max='$entry->maxvalue' />
            {$printDescription($entry)}
          </td>
HTML;
    break;

    case 'boolean':
      $checked = checked( $entry->value, true, false );
      print <<<HTML
        <td>
          <input name='$name' type="checkbox" value='1' $checked />
          {$printDescription($entry)}
        </td>
HTML;

      break;
    default:
    print <<<HTML
      <td>
        <span>$name</span>
        {$printDescription($entry)}
      </td>
HTML;
      break;
  }//switch

  print <<<HTML
    </tr>
HTML;



}
?>
      <tr>
       <td>&nbsp;</td>
       <td>  <?php submit_button(); ?></td>
      </tr>
   </table>
  </form>
</div>

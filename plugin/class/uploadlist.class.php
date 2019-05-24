<?php
/**
 * Coded By : aigenseer
 * Copyright 2019, https://github.com/aigenseer
 */
if ( ! class_exists( 'WP_List_Table' ) ) {
	require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

class FIU_UploadList extends WP_List_Table
{
    private $db;

    public function __construct() {
      parent::__construct();
      $this->db = new FIU_UploadTable(FIU_PREFIX);
    }

    /** Text displayed when no customer data is available */
  	public function no_items() {
  		_e( 'No entry avaliable.', 'sp' );
  	}

    /**
     * Prepare the items for the table to process
     *
     * @return Void
     */
    public function prepare_items()
    {
        $columns = $this->get_columns();
        $hidden = $this->get_hidden_columns();
        $sortable = $this->get_sortable_columns();

        $this->_column_headers = array($columns, $hidden, $sortable);

        $data = $this->db->getAll();
        usort( $data, array( &$this, 'sort_data' ) );
        $perPage = 5;
        $currentPage = $this->get_pagenum();
        $totalItems = count($data);
        $this->set_pagination_args( array(
            'total_items' => $totalItems,
            'per_page'    => $perPage
        ) );
        $data = array_slice($data,(($currentPage-1)*$perPage),$perPage);
        $this->items = $data;

    }
    /**
     * Override the parent columns method. Defines the columns to use in your listing table
     *
     * @return Array
     */
    public function get_columns()
    {
        $columns = array(
            'cb'        => '<input type="checkbox" />',
            'id'          => 'ID',
						'timestamp' => 'timestamp',
            'image'       => 'Image'
        );
        return $columns;
    }

    /**
  	 * Render the bulk edit checkbox
  	 *
  	 * @param array $item
  	 *
  	 * @return string
  	 */
    public function column_cb($item) {
        return sprintf('<input type="checkbox" name="items[]" value="%s" />', $item['id']);
    }

    /**
     * Define which columns are hidden
     *
     * @return Array
     */
    public function get_hidden_columns()
    {
        return array('id');
    }
    /**
     * Define the sortable columns
     *
     * @return Array
     */
    public function get_sortable_columns()
    {
      return array('timestamp' => array('timestamp', true));
    }

    /**
     * @Override
     * @return Array
     */
    public function get_bulk_actions()
		{
      $actions = array(
        sprintf('%s-delete', UPLOAD_IMAGE_PREFIX)    => 'Delete',
        sprintf('%s-download', UPLOAD_IMAGE_PREFIX)    => 'Download'
      );
      return $actions;
    }

    /**
     * Define what data to show on each column of the table
     *
     * @param  Array $item        Data
     * @param  String $column_name - Current column name
     *
     * @return Mixed
     */
    public function column_default( $item, $column_name )
    {
        switch( $column_name ) {
            case 'id':
            case 'timestamp':
                return $item[ $column_name ];
            case 'image':
                return sprintf('<img src="%s" height="150" width="150">', $item['url']);
            default:
                return print_r( $item, true ) ;
        }
    }
    /**
     * Allows you to sort the data by the variables set in the $_GET
     *
     * @return Mixed
     */
    private function sort_data( $a, $b )
    {
        // Set defaults
        $orderby = 'timestamp';
        $order = 'asc';
        // If orderby is set, use this as the sort column
        if(!empty($_GET['orderby']))
        {
					$value = sanitize_text_field($_GET['orderby']);
					if(in_array($value, array_keys($this->get_sortable_columns()))){
						$orderby = $value;
					}
        }
        // If order is set use this as the order
        if(!empty($_GET['order']))
        {
					$value = sanitize_text_field($_GET['orderby']);
					if($value == 'asc' and $value == 'desc'){
						$order = $value;
					}
        }

        $result = strcmp( $a[$orderby], $b[$orderby] );
        if($order === 'asc')
        {
            return $result;
        }
        return -$result;
    }

		/**
		 * [start the process bulk actions]
		 */
    public function process_bulk_action()
		{
      $this->bulk_action_download();
      $this->bulk_action_delete();
    }

		/**
		 * [check the item from $_POST and deliver validate list]
		 * @return array
		 */
		private function getValidateItems(){
			$items = [];
			if(array_key_exists('items', $_POST) and is_array($_POST['items'])){
				foreach ($_POST['items'] as $item) {
					$items[] = intval(sanitize_key($item));
				}
			}
			return $items;
		}

		/**
		 * [fetch the items from global $_POST variable and create a zip archiv to download it]
		 */
    private function bulk_action_download(){
			$items = $this->getValidateItems();
      if ( isset($_POST['action'])
        and $_POST['action'] == UPLOAD_IMAGE_PREFIX.'-download'
        and count($items) > 0 )
      {
        $filename = tempnam("tmp", "zip");

        $zip = new ZipArchive();
        if ($zip->open($filename, ZipArchive::CREATE)!==TRUE) {
            exit("cannot open <$filename>\n");
        }
        foreach ($items as $id) {
          $entry = $this->db->get($id);
          if(file_exists($entry->path))
          {
            $zip->addFile($entry->path, end(explode('/',$entry->path)));
          }
        }
        $zip->close();

        header("Content-type: application/zip");
        header("Content-Disposition: attachment; filename=".UPLOAD_IMAGE_PREFIX.".zip");
        header("Pragma: no-cache");
        header("Expires: 0");
        readfile("$filename");
        exit();
      }
    }

		/**
		 * [ the ids from global $_POST variable and delete the entrys ]
		 */
    private function bulk_action_delete(){
			$items = $this->getValidateItems();
      if ( isset($_POST['action'])
        and $_POST['action'] == UPLOAD_IMAGE_PREFIX.'-delete'
        and count($items) > 0 )
      {
        $delete_ids = esc_sql( $items );
        $this->db->delete($delete_ids);
      }
    }

}







 ?>

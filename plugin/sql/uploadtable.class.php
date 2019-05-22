<?php
/**
 * Coded By : aigenseer
 * Copyright 2019, https://github.com/aigenseer
 */
class FIU_UploadTable {

  /**
   * [__construct]
   * @param string   $tablename
   */
  function __construct($tablename)
  {
    global $wpdb;
    $this->wpdb = $wpdb;
    $this->tablename = $this->wpdb->prefix.$tablename;
  }

  /**
   * [create the table "$this->tablename"]
   */
  public function createTable()
  {
    $charset_collate = $this->wpdb->get_charset_collate();
    $sql = "CREATE TABLE $this->tablename (
      `id` INT(11) NOT NULL AUTO_INCREMENT ,
      `fingerprint` VARCHAR(32) NOT NULL ,
      `path` TEXT NOT NULL ,
      `url` TEXT NOT NULL ,
      `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
       PRIMARY KEY (`id`)
     ) $charset_collate";
    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta( $sql );
  }

  /**
   * [add entry]
   * @param String $fingerprint
   * @param String $filePath
   * @param String $urlPath
   */
  public function add(string $fingerprint, string $filePath, string $urlPath)
  {
    $str = "INSERT INTO `%s` (`fingerprint`, `path`, `url`) values('%s', '%s', '%s') ";
    $sql = sprintf($str, $this->tablename, $fingerprint, $filePath, $urlPath);
    $this->wpdb->query($sql);
  }

  /**
   * [deliver count of entrys]
   * @return Integer
   */
  public function getCount()
  {
    $str = "SELECT COUNT(*) FROM `%s`";
    $sql = sprintf($str, $this->tablename);
    return intval($this->wpdb->get_var( $sql ));
  }

  /**
   * [deliver entry from id]
   * @param  Integer $id
   * @return Array
   */
  public function get($id)
  {
    $str = "SELECT * FROM `%s` WHERE `id` = %d";
    $sql = sprintf($str, $this->tablename, $id);
    return $this->wpdb->get_row( $sql );
  }

  /**
   * [deliver all entrys sorted with DESC]
   * @return Array
   */
  public function getAll()
  {
    $str = "SELECT * FROM `%s` ORDER BY `timestamp` DESC";
    $sql = sprintf($str, $this->tablename);
    return $this->wpdb->get_results( $sql, 'ARRAY_A' );
  }

  /**
   * [delete list of entrys]
   * @param  Array  $ids
   */
  public function delete($ids=[])
  {
    foreach ($ids as $id) {
      $entry = $this->get($id);
      if(file_exists($entry->path))
      {
        unlink($entry->path);
      }
      $str = "DELETE FROM `%s` WHERE `id` = %d";
      $sql = sprintf($str, $this->tablename, $id);
      $this->wpdb->query($sql);
    }
  }

  /**
   * [deliver count of entrys from fingerprint from this day]
   * @param  String $fingerprint
   * @return Integer
   */
  public function getCountFingerprint($fingerprint)
  {
    $str = 'SELECT COUNT(*) as \'count\' FROM `%s` WHERE `fingerprint` LIKE "%s" AND date(`timestamp`) = CURDATE()';
    $sql = sprintf($str, $this->tablename, $fingerprint);
    return intval($this->wpdb->get_var( $sql ));
  }


}
?>

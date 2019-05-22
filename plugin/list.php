<?php
/**
 * Coded By : aigenseer
 * Copyright 2019, https://github.com/aigenseer
 */
global $fiu_uploadlist;
$fiu_uploadlist->prepare_items();
?>

<div id="poststuff">
	<div id="post-body" class="metabox-holder columns-2">
		<div id="post-body-content">
			<div class="meta-box-sortables ui-sortable">
				<form method="post">
					<?php $fiu_uploadlist->display(); ?>
				</form>
			</div>
		</div>
	</div>
	<br class="clear">
</div>

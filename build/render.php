<?php

/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

// Get Links
if (!empty($attributes['links'])) {
	$links = $attributes['links'];
} else {
	$links = [];
}

?>
<nav <?php echo get_block_wrapper_attributes(); ?>>
	<ul>
		<?php foreach ($links as $link) : ?>
			<li>
				<a href="<?php echo isset($link['url']) ? $link['url'] : ''; ?>" target="<?php echo isset($link['target']) ? $link['target'] : '_self'; ?>"><?php echo isset($link['text']) ? $link['text'] : ''; ?></a>
			</li>
		<?php endforeach; ?>
	</ul>
</nav>
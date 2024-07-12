<?php

/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

// Get SVG 
$svg_path = plugin_dir_path(dirname(__FILE__)) . 'assets/menu.svg';
$svg_content = file_get_contents($svg_path);

if (!empty($attributes['menuColor'])) {
	// Load SVG content into DOMDocument
	$dom = new DOMDocument();
	$dom->loadXML($svg_content, LIBXML_NOERROR);

	// Add style attribute to <svg> element
	$svg_elements = $dom->getElementsByTagName('svg');
	foreach ($svg_elements as $svg_element) {
		$svg_element->setAttribute('style', 'fill: ' . esc_attr($attributes['menuColor']));
	}

	$svg = $dom->saveXML();
} else {
	$svg = $svg_content;
}

// Get Links
if (!empty($attributes['links'])) {
	$links = $attributes['links'];
} else {
	$links = [];
}

?>
<nav <?php echo get_block_wrapper_attributes(); ?>>
	<button id="open-mobile-menu">
		<?php echo $svg; ?>
	</button>
	<ul>
		<?php foreach ($links as $link) : ?>
			<li>
				<?php if (isset($link['group']) && $link['group'] != true) : ?>
					<a href="<?php echo isset($link['url']) ? $link['url'] : '#'; ?>" target="<?php echo isset($link['target']) ? $link['target'] : '_self'; ?>"><?php echo isset($link['text']) ? $link['text'] : ''; ?></a>
				<?php else : ?>
					<span><?php echo isset($link['text']) ? $link['text'] : ''; ?></span>
				<?php endif; ?>
			</li>
		<?php endforeach; ?>
		<li>
			<button id="close-mobile-menu">Close Menu</button>
		</li>
	</ul>
</nav>
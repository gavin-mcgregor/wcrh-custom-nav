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
	<ul class="toplevel">
		<?php foreach ($links as $link) : ?>
			<?php if (isset($link['isChild']) && $link['isChild'] === true) : ?>
			<?php elseif (isset($link['group']) && $link['group'] != true) : ?>
				<!-- Top Level -->
				<li class="nav-item">
					<a href="<?php echo isset($link['url']) ? $link['url'] : '#'; ?>" target="<?php echo isset($link['target']) ? $link['target'] : '_self'; ?>"><?php echo isset($link['text']) ? $link['text'] : ''; ?></a>
				</li>
			<?php else : ?>
				<!-- Top Level -->
				<li class="nav-item">
					<span><?php echo isset($link['text']) ? $link['text'] : ''; ?></span>
					<!-- Submenu -->
					<ul class="submenu">
						<?php $index = 0 ?>
						<?php foreach ($links as $sub_link) : ?>
							<?php if (!isset($sub_link['parentMenu'])) {
								continue;
							} elseif ($sub_link['parentMenu'] != $link['id']) {
								continue;
							} elseif ($sub_link['parentMenu'] === $sub_link['id']) {
								continue;
							} ?>
							<li class="nav-item">
								<a href="<?php echo isset($sub_link['url']) ? $sub_link['url'] : '#'; ?>" target="<?php echo isset($sub_link['target']) ? $sub_link['target'] : '_self'; ?>"><?php echo isset($sub_link['text']) ? $sub_link['text'] : ''; ?></a>
							</li>
							<?php $index++ ?>
						<?php endforeach; ?>
					</ul>
				</li>
			<?php endif; ?>
		<?php endforeach; ?>
		<!-- Close on Mobile -->
		<li>
			<button id="close-mobile-menu">Close Menu</button>
		</li>
	</ul>
</nav>
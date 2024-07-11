/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import {
	PanelBody,
	Flex,
	FlexItem,
	Button,
	TextControl,
	ToggleControl,
	RadioControl,
} from "@wordpress/components";

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./editor.scss";

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	// Attributes
	const { links } = attributes;

	// Remove Nav Item
	const removeNavItem = (index) => {
		const newLinks = [...links];
		newLinks.splice(index, 1);
		setAttributes({ links: newLinks });
	};

	// Update Nav Item
	const updateNavItem = (index, value, field) => {
		const newLinks = [...links];
		newLinks[index] = { ...newLinks[index], [field]: value };
		setAttributes({ links: newLinks });
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Nav Settings")}>
					<Flex direction="column">
						<FlexItem>
							<Button
								variant="primary"
								onClick={() => {
									const newNavItem = {
										text: "",
										url: "",
										target: "_blank",
										group: false,
									};
									setAttributes({ links: [...links, newNavItem] });
								}}
							>
								{__("Add Link")}
							</Button>
						</FlexItem>
					</Flex>
				</PanelBody>
				{links &&
					links.map((navItem, index) => (
						<PanelBody
							title={__(`Nav Item ${index + 1}: ${navItem.text}`)}
							key={index}
						>
							<Flex direction="column">
								<FlexItem>
									<TextControl
										label={__("Link Text")}
										value={navItem.text}
										onChange={(value) => updateNavItem(index, value, "text")}
									/>
									{!navItem.group && (
										<>
											<TextControl
												label={__("Link Url")}
												value={navItem.url}
												onChange={(value) => updateNavItem(index, value, "url")}
											/>
											<RadioControl
												label={__("Link Target")}
												selected={navItem.target}
												options={[
													{ label: "New Tab", value: "_blank" },
													{ label: "Same Tab", value: "_self" },
												]}
												onChange={(value) =>
													updateNavItem(index, value, "target")
												}
											/>
										</>
									)}
									<ToggleControl
										checked={!!navItem.group}
										label={__("Nav Item has submenu")}
										onChange={(value) => updateNavItem(index, value, "group")}
									/>
									<Button
										variant="secondary"
										onClick={() => removeNavItem(index)}
									>
										{__("Remove Link")}
									</Button>
								</FlexItem>
							</Flex>
						</PanelBody>
					))}
			</InspectorControls>
			<div {...useBlockProps()}>
				{links.length > 0 ? (
					<ul>
						{links.map((navItem, index) => (
							<li key={index}>{navItem.text}</li>
						))}
					</ul>
				) : (
					<ul>
						<li>Nothing to list</li>
					</ul>
				)}
			</div>
		</>
	);
}

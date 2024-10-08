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
	TabPanel,
	Flex,
	FlexItem,
	Button,
	TextControl,
	ToggleControl,
	RadioControl,
	ColorPalette,
	SelectControl,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";

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

// Import SVG
import { useEffect, useState } from "@wordpress/element";
import menuSVG from "../assets/menu.svg";

export default function Edit({ attributes, setAttributes }) {
	// Attributes
	const { links, menuColor } = attributes;

	// Drag and Drop Handlers
	const [draggedItemIndex, setDraggedItemIndex] = useState(null);

	const handleDragStart = (index) => () => {
		setDraggedItemIndex(index);
	};

	const handleDragOver = (index) => (e) => {
		e.preventDefault();
	};

	const handleDrop = (index) => () => {
		const newLinks = [...links];
		const [draggedItem] = newLinks.splice(draggedItemIndex, 1);
		newLinks.splice(index, 0, draggedItem);
		setAttributes({ links: newLinks });
		setDraggedItemIndex(null);
	};

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

	// Select & save the fill colour
	const onChangeFill = (newColor) => {
		setAttributes({ menuColor: newColor });
	};

	// Fetch the colors from theme.json
	const paletteColors = useSelect((select) => {
		return select("core/editor").getEditorSettings().colors;
	}, []);

	// Convert to HTML
	const [svgContent, setSvgContent] = useState("");
	useEffect(() => {
		fetch(menuSVG)
			.then((response) => response.text())
			.then((data) => {
				const dataStyled = data.replace(
					"<svg",
					`<svg style="fill: ${menuColor}"`,
				);
				setSvgContent(dataStyled);
			});
	}, [menuColor]);

	// Array for top level nav items
	const [toplevelNavItems, setToplevelNavItems] = useState([]);
	useEffect(() => {
		const newLinkArray = [];
		links.map((option) => !option.isChild && newLinkArray.push(option));
		setToplevelNavItems(newLinkArray);
	}, [links]);

	// Array for parent nav items
	const [parentNavItems, setparentNavItems] = useState([]);
	useEffect(() => {
		const newLinkArray = [];
		links.map((option) => option.group && newLinkArray.push(option));
		setparentNavItems(newLinkArray);
	}, [links]);

	return (
		<>
			<InspectorControls>
				<TabPanel
					activeClass="active-tab"
					tabs={[
						{
							name: "link-settings",
							title: __("Links"),
							className: "links-settings-tab",
						},
						{
							name: "nav-order",
							title: __("Order"),
							className: "nav-order-tab",
						},
						{
							name: "mobile-settings",
							title: __("Mobile"),
							className: "mobile-settings-tab",
						},
					]}
				>
					{(tab) => (
						<>
							{tab.name === "mobile-settings" && (
								<PanelBody title={__("Mobile Settings")}>
									<Flex direction="column">
										<FlexItem>
											<p>
												This is for the hamburger menu icon which will be shown
												on mobile. To preview the menu resize the editor window
												to less than 600px wide.
											</p>
										</FlexItem>
										<FlexItem>
											<ColorPalette
												label={__("Menu Colour")}
												colors={paletteColors.map((color) => ({
													name: color.name,
													color: color.color,
												}))}
												value={menuColor}
												onChange={onChangeFill}
											/>
										</FlexItem>
									</Flex>
								</PanelBody>
							)}
							{tab.name === "nav-order" && (
								<PanelBody title={__("Nav Order")}>
									<Flex direction="column">
										<FlexItem>
											<p>
												Drag and drop the links below to change the order of the
												top level navigation.
											</p>
										</FlexItem>
										<FlexItem>
											{toplevelNavItems.length > 0 ? (
												<ul className="nav-order-list">
													{toplevelNavItems.map((navItem, index) => (
														<li
															key={index}
															draggable
															onDragStart={handleDragStart(index)}
															onDragOver={handleDragOver(index)}
															onDrop={handleDrop(index)}
															style={{ cursor: "move" }}
														>
															{navItem.text}
														</li>
													))}
												</ul>
											) : (
												<ul>
													<li>Nothing to list</li>
												</ul>
											)}
										</FlexItem>
									</Flex>
								</PanelBody>
							)}
							{tab.name === "link-settings" && (
								<>
									<PanelBody title={__("Add Links")}>
										<Flex direction="column">
											<FlexItem>
												<Button
													variant="primary"
													onClick={() => {
														const newNavItem = {
															text: "",
															url: "",
															target: "_self",
															group: false,
															isChild: false,
															parentMenu: "",
															id: links.length,
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
												title={__(
													`— ${
														navItem.text ? `${navItem.text}` : "New Nav Item"
													} ${navItem.isChild ? "(Submenu)" : "(Top Level)"}`,
												)}
												key={index}
												initialOpen={false}
											>
												<Flex direction="column">
													<FlexItem>
														<TextControl
															label={__("Link Text")}
															value={navItem.text}
															onChange={(value) =>
																updateNavItem(index, value, "text")
															}
														/>
														{!navItem.group && (
															<>
																<TextControl
																	label={__("Link Url")}
																	value={navItem.url}
																	onChange={(value) =>
																		updateNavItem(index, value, "url")
																	}
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
															label={__("Has Submenu?")}
															onChange={(value) =>
																updateNavItem(index, value, "group")
															}
														/>
														<ToggleControl
															checked={!!navItem.isChild}
															label={__("Has Parent?")}
															onChange={(value) =>
																updateNavItem(index, value, "isChild")
															}
														/>
														{navItem.isChild && (
															<SelectControl
																label={__("Add to Submenu")}
																value={navItem.parentMenu}
																options={[
																	{
																		label: __("Please Select Parent"),
																		value: "",
																		disabled: true,
																	},
																	...parentNavItems.map((option) => ({
																		label: option.text,
																		value: option.id,
																	})),
																]}
																onChange={(value) =>
																	updateNavItem(index, value, "parentMenu")
																}
															/>
														)}
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
								</>
							)}
						</>
					)}
				</TabPanel>
			</InspectorControls>
			<div {...useBlockProps()}>
				<button
					id="open-mobile-menu"
					className={`svg-container${menuColor ? ` fill-${menuColor}` : ""}`}
					dangerouslySetInnerHTML={{ __html: svgContent }}
				/>
				{links.length > 0 ? (
					<ul className="toplevel">
						{links.map(
							(navItem, index) =>
								!navItem.isChild && <li key={index}>{navItem.text}</li>,
						)}
						<li>Close Menu</li>
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

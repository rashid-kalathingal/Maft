import type {
  Category,
  Colour,
  Product,
  ProductVariant,
  Settings,
  Size,
} from "@/types";

/* ------------------------------------------------------------------ */
/*  Master data: categories, colours, sizes                            */
/* ------------------------------------------------------------------ */

export const seedCategories: Category[] = [
  { id: "cat-recliner", name: "Recliner Mechanisms & Accessories", slug: "recliner-mechanisms", icon: "🛋️", sortOrder: 1, isActive: true, description: "Manual & motorised recliner mechanisms, jointers, switches and motor accessories." },
  { id: "cat-legs", name: "Sofa Legs & Furniture Legs", slug: "sofa-legs", icon: "🦵", sortOrder: 2, isActive: true, description: "Metal and PVC legs in every finish — star, T, cone/kulfi, Italian, Russian and more." },
  { id: "cat-fittings", name: "Sofa & Bed Fittings", slug: "sofa-bed-fittings", icon: "🔧", sortOrder: 3, isActive: true, description: "Headrest, armrest, sofa-cum-bed, hydraulic hinges, connectors and metal plates." },
  { id: "cat-chair-bases", name: "Chair Bases & Components", slug: "chair-bases", icon: "💺", sortOrder: 4, isActive: true, description: "Rotating plates, chire bases and metal chair frames." },
  { id: "cat-accessories", name: "Cup Holders & Charging Accessories", slug: "cup-holders-charging", icon: "🔌", sortOrder: 5, isActive: true, description: "Cup holders, USB chargers and wireless charging modules." },
  { id: "cat-springs", name: "Springs & Upholstery Components", slug: "springs-upholstery", icon: "🌀", sortOrder: 6, isActive: true, description: "Pocketed & zig-zag springs, buttons, elastic belts and cotton ropes." },
  { id: "cat-fasteners", name: "Screws, Nails & Fasteners", slug: "fasteners", icon: "🔩", sortOrder: 7, isActive: true, description: "Staple pins, brad nails, screws, T-nuts and bushes." },
  { id: "cat-fabrics", name: "Upholstery Fabrics & Materials", slug: "fabrics-materials", icon: "🧵", sortOrder: 8, isActive: true, description: "Sofa fabrics, non-woven, wadding, fibre, piping and rexin." },
  { id: "cat-adhesives", name: "Adhesives & Packing Materials", slug: "adhesives-packing", icon: "📦", sortOrder: 9, isActive: true, description: "Spray adhesives, stretch film and PVC strips." },
  { id: "cat-other", name: "Other Furniture Accessories", slug: "other-accessories", icon: "✨", sortOrder: 10, isActive: true, description: "Storage boxes and general furniture accessories." },
];

const catSlug = (short: string) => `cat-${short}`;

export const seedColours: Colour[] = [
  { id: "col-black", name: "Black", hexCode: "#1a1a1a", isActive: true },
  { id: "col-gold", name: "Gold", hexCode: "#c9a227", isActive: true },
  { id: "col-silver", name: "Silver/Chrome", hexCode: "#c4c8ce", isActive: true },
  { id: "col-rosegold", name: "Rose Gold", hexCode: "#b76e79", isActive: true },
  { id: "col-gunmetal", name: "Gun Metal Black", hexCode: "#2b2f33", isActive: true },
  { id: "col-blackgold", name: "Black & Gold", hexCode: "#1a1a1a", secondaryHexCode: "#c9a227", isActive: true },
  { id: "col-woodgold", name: "Wood & Gold", hexCode: "#6b4b2a", secondaryHexCode: "#c9a227", isActive: true },
  { id: "col-wooden", name: "Wooden Finish", hexCode: "#6b4b2a", isActive: true },
  { id: "col-brown", name: "Brown", hexCode: "#5a3b22", isActive: true },
  { id: "col-beige", name: "Beige", hexCode: "#d8c7a0", isActive: true },
  { id: "col-matblack", name: "Mat Black", hexCode: "#222222", isActive: true },
];

const colourByName: Record<string, string> = Object.fromEntries(
  seedColours.map((c) => [c.name, c.id]),
);

// Size master is derived from referenced labels + a curated base set.
const sizeUnitFor = (label: string): Size["unit"] => {
  if (/mm/i.test(label)) return "mm";
  if (/cm/i.test(label)) return "cm";
  if (/\bm\b|metre/i.test(label)) return "m";
  if (/inch/i.test(label)) return "inch";
  return "custom";
};
const sizeValueFor = (label: string): number | undefined => {
  const m = label.match(/[\d.]+/);
  return m ? parseFloat(m[0]) : undefined;
};

/* ------------------------------------------------------------------ */
/*  Raw catalogue (faithful to the MAFT MARKETING PDF, 198 items)      */
/* ------------------------------------------------------------------ */

interface Raw {
  n: string; // name
  c: string; // category short slug
  colours?: string[];
  sizes?: string[];
  pack?: string;
  specs?: [string, string][];
  feat?: boolean;
  nw?: boolean;
  na?: boolean; // marked "NA" / not available in the catalogue
}

const RAW: Raw[] = [
  // ---- Recliner mechanisms & accessories ----
  { n: "Recliner Mechanism – 1R Manual", c: "recliner", specs: [["Type", "1R Manual, Long Patta"], ["Weight", "11.6 KG"], ["Includes", "Metal Mouse"]] },
  { n: "Recliner Mechanism – 1R Motor", c: "recliner", specs: [["Type", "1R Motor, Long Patta"], ["Weight", "15.6 KG"], ["Switch", "With USB"]], feat: true },
  { n: "Recliner Mechanism – 3R Manual", c: "recliner", specs: [["Type", "3R Manual, Long Patta"], ["Weight", "18.9 KG"], ["Includes", "Metal Mouse"]] },
  { n: "Recliner Mechanism – 3R Motor", c: "recliner", specs: [["Type", "3R Motor"], ["Weight", "19.4 KG"], ["Switch", "With USB"]], feat: true },
  { n: "Recliner Mechanism – 396 Motor", c: "recliner", specs: [["Type", "396 Motor"], ["Weight", "15.7 KG"], ["Switch", "With USB"]] },
  { n: "Recliner Mechanism – 3618 Motor", c: "recliner", specs: [["Type", "3618 Motor"], ["Weight", "15.2 KG"], ["Switch", "With USB"]] },
  { n: "Recliner Accessories – Metal Mouse", c: "recliner", specs: [["Type", "Recliner Lever (Metal Mouse)"]] },
  { n: "Recliner Jointer – 2 Seater", c: "recliner", specs: [["Type", "2 Seater jointer rail"]] },
  { n: "Recliner Jointer – 2 Seater Console", c: "recliner", specs: [["Type", "2 Seater console jointer"]] },
  { n: "Recliner Jointer – 3 Seater", c: "recliner", specs: [["Type", "3 Seater jointer rail"]] },
  { n: "Recliner Motor Switch – Oval (Black)", c: "recliner", colours: ["Black"], specs: [["Shape", "Oval"]] },
  { n: "Recliner Motor Switch – Gold (without Type-C)", c: "recliner", colours: ["Gold"], specs: [["Ports", "USB (no Type-C)"]] },
  { n: "Recliner Motor Switch – Ornate (USB + Type-C)", c: "recliner", specs: [["Ports", "USB and Type-C"]], feat: true, nw: true },
  { n: "Recliner Motor Switch – Normal (with USB)", c: "recliner", specs: [["Ports", "USB"]] },

  // ---- Cup holders & charging accessories ----
  { n: "USB Charger – Dual USB", c: "accessories", colours: ["Rose Gold", "Black"], specs: [["Quality", "High quality dual-USB"]], nw: true },
  { n: "USB Charger – Pressing Type (3 Port)", c: "accessories", colours: ["Silver/Chrome"], specs: [["Ports", "3 USB"], ["Shape", "Triangle or Round"]] },
  { n: "Wireless Charger", c: "accessories", colours: ["Black"], specs: [["Ports", "USB & Type-C"]], feat: true },
  { n: "Cup Holder – Pressing Type", c: "accessories", colours: ["Black", "Silver/Chrome"], pack: "18 PCS BOX" },
  { n: "Cup Holder – Plastic Normal", c: "accessories", colours: ["Black"], pack: "100 / 200 PCS BAG", specs: [["Guarantee", "Replacement guarantee"]] },
  { n: "Cup Holder – Silver Chrome", c: "accessories", colours: ["Silver/Chrome"], specs: [["Material", "Plastic chrome"]] },
  { n: "Cup Holder – Gold Finish", c: "accessories", colours: ["Gold"], specs: [["Material", "Plastic"]] },

  // ---- Sofa & bed fittings ----
  { n: "Arm Rest Fitting (Handrest)", c: "fittings", sizes: ["28 CM"] },
  { n: "Back Rest Fittings", c: "fittings", sizes: ["22.5 CM"] },
  { n: "Sofa Head Rest Fittings – Heavy", c: "fittings", pack: "50 PCS BOX", specs: [["Weight", "420 G"]] },
  { n: "Sofa Head Rest – Tik-Tok Normal", c: "fittings", pack: "50 PCS BOX", specs: [["Weight", "310 G"]] },
  { n: "Sofa Cum Bed Puller Fitting", c: "fittings", pack: "5 SETS BOX", specs: [["Includes", "Attached rail & wheel"]] },
  { n: "Sofa Cum Bed Crocodile Fitting (30cm)", c: "fittings", sizes: ["30 CM"], specs: [["Weight", "1550 G"]] },
  { n: "Sofa Cum Bed Crocodile Fitting (25cm)", c: "fittings", sizes: ["25 CM"], pack: "25 SETS BOX", specs: [["Weight", "920 G"]] },
  { n: "Hydraulic Bed Hinges – 90cm (3ft)", c: "fittings", sizes: ["90 CM"], pack: "1 SET PACK", specs: [["Capacity", "60 KG"]] },
  { n: "Hydraulic Bed Hinges – 120cm (5ft)", c: "fittings", sizes: ["120 CM"], pack: "1 SET PACK", specs: [["Capacity", "90 KG"]] },
  { n: "Sofa Connecter – Metal Heavy", c: "fittings", specs: [["Type", "Metal, heavy"]] },
  { n: "Sofa Connecter – Male & Female", c: "fittings", specs: [["Type", "Normal, 2 PCS = 1 SET"]] },
  { n: "Metal Plate 80×80mm", c: "fittings", pack: "262 PCS BAG", specs: [["Thickness", "1 MM"], ["Weight", "96 G"]] },
  { n: "Metal Plate with Thread 70×70mm", c: "fittings", na: true },
  { n: "Auto Close Hinges", c: "fittings", colours: ["Silver/Chrome"], specs: [["Material", "MS"], ["Pack", "2 PCS SET"]] },

  // ---- Chair bases & components ----
  { n: "Chire Base Rotating Plate – 6\" Bearing", c: "chair-bases", sizes: ["6 Inches"], pack: "15 PCS BOX", specs: [["Type", "Bearing type, heavy"]] },
  { n: "Chire Base Rotating Plate – 10\" Dual Bearing", c: "chair-bases", sizes: ["10 Inches"], specs: [["Type", "Dual bearing, heavy"]], feat: true },
  { n: "Chire Leg – Black 18\"", c: "chair-bases", colours: ["Black"], sizes: ["18 Inches"] },
  { n: "Chire Leg – Black & Gold 18\"", c: "chair-bases", colours: ["Black & Gold"], sizes: ["18 Inches"] },
  { n: "Chire Leg with Metal Frame", c: "chair-bases", sizes: ["15.5 Inches"], specs: [["Pack", "SET ONLY (for 2 pcs)"]] },
  { n: "Metal Chire Base Frame – Model 02", c: "chair-bases", specs: [["Note", "Leg base only, without rotating plate"]], na: true },
  { n: "Metal Chire Base Frame – Model 03", c: "chair-bases", sizes: ["15 Inches"], specs: [["Note", "Leg base only, without rotating plate"]] },
  { n: "Metal Chire Base Frame – Model 04", c: "chair-bases", sizes: ["14 Inches"], specs: [["Note", "Leg base only, without rotating plate"]] },
  { n: "Metal Chire Base Frame – Model 05", c: "chair-bases", sizes: ["17 Inches"], specs: [["Note", "Leg base only, without rotating plate"]] },
  { n: "Chire Leg Cup – Golden", c: "chair-bases", colours: ["Gold"], sizes: ["3 Inches"] },

  // ---- Sofa legs & furniture legs ----
  { n: "Star Leg – Black 5\"", c: "legs", colours: ["Black"], sizes: ["5 Inches"], pack: "60 PCS BOX" },
  { n: "Star Leg – Silver/Chrome 5\"", c: "legs", colours: ["Silver/Chrome"], sizes: ["5 Inches"], pack: "60 PCS BOX" },
  { n: "Star Leg – Gold 5\"", c: "legs", colours: ["Gold"], sizes: ["5 Inches"], pack: "60 PCS BOX" },
  { n: "Star Leg – Black 6\"", c: "legs", colours: ["Black"], sizes: ["6 Inches"], pack: "60 PCS BOX" },
  { n: "Star Leg – Silver/Chrome 6\"", c: "legs", colours: ["Silver/Chrome"], sizes: ["6 Inches"], pack: "60 PCS BOX" },
  { n: "Star Leg – Gold 6\"", c: "legs", colours: ["Gold"], sizes: ["6 Inches"], pack: "60 PCS BOX" },
  { n: "T Cut Leg – Gold 5\"", c: "legs", colours: ["Gold"], sizes: ["5 Inches"], pack: "60 PCS BOX" },
  { n: "T Leg – Gold 4\"", c: "legs", colours: ["Gold"], sizes: ["4 Inches"], pack: "100 PCS BOX" },
  { n: "T Leg – Black 4\"", c: "legs", colours: ["Black"], sizes: ["4 Inches"], pack: "100 PCS BOX" },
  { n: "T Leg – Silver/Chrome 4\"", c: "legs", colours: ["Silver/Chrome"], sizes: ["4 Inches"], pack: "100 PCS BOX" },
  { n: "T Leg – Rose Gold 4\"", c: "legs", colours: ["Rose Gold"], sizes: ["4 Inches"], pack: "100 PCS BOX", nw: true },
  { n: "T Leg – Gold 5\"", c: "legs", colours: ["Gold"], sizes: ["5 Inches"], pack: "100 PCS BOX" },
  { n: "T Leg – Black 5\"", c: "legs", colours: ["Black"], sizes: ["5 Inches"], pack: "100 PCS BOX" },
  { n: "T Leg – Silver/Chrome 5\"", c: "legs", colours: ["Silver/Chrome"], sizes: ["5 Inches"], pack: "100 PCS BOX" },
  { n: "L Shape Leg – Silver 3\"", c: "legs", colours: ["Silver/Chrome"], sizes: ["3 Inches"] },
  { n: "Spanish Frame Leg – Gold 6\"", c: "legs", colours: ["Gold"], sizes: ["6 Inches"], pack: "60 PCS BOX" },
  { n: "Spanish Frame Leg – Gun Metal Black 6\"", c: "legs", colours: ["Gun Metal Black"], sizes: ["6 Inches"], pack: "60 PCS BOX" },
  { n: "Apex Leg – Gun Metal Black 5\"", c: "legs", colours: ["Gun Metal Black"], sizes: ["5 Inches"], pack: "60 PCS BOX" },
  { n: "Cone/Kulfi Leg – Gold 4\"", c: "legs", colours: ["Gold"], sizes: ["4 Inches"], pack: "60 PCS BOX", feat: true },
  { n: "Cone/Kulfi Leg – Black 4\"", c: "legs", colours: ["Black"], sizes: ["4 Inches"], pack: "60 PCS BOX" },
  { n: "Cone/Kulfi Leg – Black & Gold 4\"", c: "legs", colours: ["Black & Gold"], sizes: ["4 Inches"], pack: "60 PCS BOX" },
  { n: "Cone/Kulfi Leg – Gold 5\"", c: "legs", colours: ["Gold"], sizes: ["5 Inches"], pack: "60 PCS BOX" },
  { n: "Cone/Kulfi Leg – Black 4\" (Tapered)", c: "legs", colours: ["Black"], sizes: ["4 Inches"], pack: "60 PCS BOX" },
  { n: "Cone/Kulfi Leg – Black & Gold 4\" (Tapered)", c: "legs", colours: ["Black & Gold"], sizes: ["4 Inches"], pack: "60 PCS BOX" },
  { n: "Cone/Kulfi Leg – Wood & Gold 5\"", c: "legs", colours: ["Wood & Gold"], sizes: ["5 Inches"], pack: "60 PCS BOX" },
  { n: "Cone/Kulfi Leg – Wooden Shade 5\"", c: "legs", colours: ["Wooden Finish"], sizes: ["5 Inches"], pack: "60 PCS BOX" },
  { n: "Cone/Kulfi Leg – Gold 6\"", c: "legs", colours: ["Gold"], sizes: ["6 Inches"], pack: "60 PCS BOX" },
  { n: "Ring Cone/Kulfi Leg – Gold 6\"", c: "legs", colours: ["Gold"], sizes: ["6 Inches"], pack: "60 PCS BOX", specs: [["Weight", "185 g"], ["Bush", "Heavy rubber bush"]] },
  { n: "Cone/Kulfi Leg – Black 6\"", c: "legs", colours: ["Black"], sizes: ["6 Inches"], pack: "60 PCS BOX" },
  { n: "Cone/Kulfi Leg – Black & Gold 6\"", c: "legs", colours: ["Black & Gold"], sizes: ["6 Inches"], pack: "60 PCS BOX" },
  { n: "Cone/Kulfi Leg – Wood & Gold 6\"", c: "legs", colours: ["Wood & Gold"], sizes: ["6 Inches"], pack: "60 PCS BOX" },
  { n: "Cone/Kulfi Leg – Wooden Finish 6\"", c: "legs", colours: ["Wooden Finish"], sizes: ["6 Inches"], pack: "60 PCS BOX" },
  { n: "Cone/Kulfi Leg – Gold 8\"", c: "legs", colours: ["Gold"], sizes: ["8 Inches"], pack: "60 PCS BOX", feat: true },
  { n: "Ring Cone/Kulfi Leg – Gold 8\"", c: "legs", colours: ["Gold"], sizes: ["8 Inches"], pack: "60 PCS BOX", specs: [["Weight", "220 g"], ["Bush", "Heavy rubber bush"]] },
  { n: "Cone/Kulfi Leg – Black 8\"", c: "legs", colours: ["Black"], sizes: ["8 Inches"], pack: "60 PCS BOX" },
  { n: "Cone/Kulfi Leg – Black & Gold 8\"", c: "legs", colours: ["Black & Gold"], sizes: ["8 Inches"], pack: "60 PCS BOX" },
  { n: "Cone/Kulfi Leg – Gold 8\" (Ring)", c: "legs", colours: ["Gold"], sizes: ["8 Inches"], pack: "60 PCS BOX" },
  { n: "Ring Cone/Kulfi Leg – Gold 10\"", c: "legs", colours: ["Gold"], sizes: ["10 Inches"], pack: "60 PCS BOX", specs: [["Weight", "270 g"], ["Bush", "Rubber bush"]] },
  { n: "Cone/Kulfi Leg – Black 10\"", c: "legs", colours: ["Black"], sizes: ["10 Inches"], pack: "60 PCS BOX" },
  { n: "Cone/Kulfi Leg – Black & Gold 10\"", c: "legs", colours: ["Black & Gold"], sizes: ["10 Inches"], pack: "60 PCS BOX" },
  { n: "Cone/Kulfi Leg – Gold 16\"", c: "legs", colours: ["Gold"], sizes: ["16 Inches"], pack: "30 PCS BOX" },
  { n: "Cone/Kulfi Leg – Black 16\"", c: "legs", colours: ["Black"], sizes: ["16 Inches"], pack: "30 PCS BOX" },
  { n: "Cone/Kulfi Leg – Black & Gold 16\"", c: "legs", colours: ["Black & Gold"], sizes: ["16 Inches"], pack: "30 PCS BOX" },
  { n: "PC Leg – Black 6\"", c: "legs", colours: ["Black"], sizes: ["6 Inches"], pack: "60 PCS BOX" },
  { n: "Wood Tech Leg – Brown 5\"", c: "legs", colours: ["Brown"], sizes: ["5 Inches"], pack: "60 PCS BOX" },
  { n: "Wood Tech Leg – Beige 5\"", c: "legs", colours: ["Beige"], sizes: ["5 Inches"], pack: "60 PCS BOX" },
  { n: "Italian Frame Leg – Mat Black 5\"", c: "legs", colours: ["Mat Black"], sizes: ["5 Inches"], pack: "60 PCS BOX", feat: true },
  { n: "Italian Frame Leg – Gun Metal Black 5\"", c: "legs", colours: ["Gun Metal Black"], sizes: ["5 Inches"], pack: "60 PCS BOX" },
  { n: "Italian Frame Leg – Silver/Chrome 6\"", c: "legs", colours: ["Silver/Chrome"], sizes: ["6 Inches"], pack: "60 PCS BOX" },
  { n: "Italian Frame Leg – Mat Black 6\"", c: "legs", colours: ["Mat Black"], sizes: ["6 Inches"], pack: "50 / 60 PCS BOX" },
  { n: "Italian Frame Leg – Gun Metal Black 6\"", c: "legs", colours: ["Gun Metal Black"], sizes: ["6 Inches"], pack: "60 PCS BOX" },
  { n: "Italian Frame Leg – Gold 6\"", c: "legs", colours: ["Gold"], sizes: ["6 Inches"], pack: "60 PCS BOX" },
  { n: "Russian Frame Leg – Gun Metal Black 6\"", c: "legs", colours: ["Gun Metal Black"], sizes: ["6 Inches"], pack: "60 PCS BOX" },
  { n: "Russian Frame Leg – Gold 6\"", c: "legs", colours: ["Gold"], sizes: ["6 Inches"], pack: "60 PCS BOX" },
  { n: "Puffy Leg H – Gun Metal Black", c: "legs", colours: ["Gun Metal Black"], sizes: ["6+2 Inches"], pack: "30 PCS BOX" },
  { n: "Puffy Leg H – Gold", c: "legs", colours: ["Gold"], sizes: ["7+2 Inches"], pack: "30 PCS BOX" },
  { n: "Puffy Leg Normal – Gun Metal Black", c: "legs", colours: ["Gun Metal Black"], sizes: ["6+2 Inches"], pack: "30 PCS BOX" },
  { n: "Puffy Leg Normal – Gold", c: "legs", colours: ["Gold"], sizes: ["6+2 Inches"], pack: "30 PCS BOX" },
  { n: "Stylish Leg – Mat Black 5\"", c: "legs", colours: ["Mat Black"], sizes: ["5 Inches"], pack: "60 PCS BOX" },
  { n: "Hairpin Leg – Black 6\"", c: "legs", colours: ["Black"], sizes: ["6 Inches"], pack: "60 PCS BOX" },
  { n: "Support Leg – Gold 6\" (Adjustable)", c: "legs", colours: ["Gold"], sizes: ["6 Inches"], specs: [["Height", "Adjustable"], ["Quality", "Normal"]] },
  { n: "Support Leg – Black 6\" (Adjustable)", c: "legs", colours: ["Black"], sizes: ["6 Inches"], specs: [["Height", "Adjustable"], ["Quality", "Normal"]] },
  { n: "Heavy Support Leg – 4\" to 6\"", c: "legs", colours: ["Black"], sizes: ["4-6 Inches"], specs: [["Height", "Adjustable"], ["Quality", "Heavy, stable"]] },
  { n: "Heavy Support Leg – 5\" to 8\"", c: "legs", colours: ["Black"], sizes: ["5-8 Inches"], specs: [["Height", "Adjustable"], ["Quality", "Heavy, stable"]] },
  { n: "Heavy Support Leg – 6\" to 10\"", c: "legs", colours: ["Black"], sizes: ["6-10 Inches"], specs: [["Height", "Adjustable"], ["Quality", "Heavy, stable"]] },
  { n: "Pyramid Leg – Gun Metal Black 5\"", c: "legs", colours: ["Gun Metal Black"], sizes: ["5 Inches"], pack: "60 PCS BOX" },
  { n: "V Shape Leg – Gold 6\"", c: "legs", colours: ["Gold"], sizes: ["6 Inches"], pack: "60 PCS BOX" },
  { n: "V Shape Leg – Black 6\"", c: "legs", colours: ["Black"], sizes: ["6 Inches"], pack: "60 PCS BOX" },
  { n: "V Cut Shape Leg – Gold 6\"", c: "legs", colours: ["Gold"], sizes: ["6 Inches"], pack: "60 PCS BOX", nw: true },
  { n: "Multi Pin Leg – Gold 6\"", c: "legs", colours: ["Gold"], sizes: ["6 Inches"], pack: "60 PCS BOX" },
  { n: "Solid Thumb Leg – Black 6\"", c: "legs", colours: ["Black"], sizes: ["6 Inches"], specs: [["Material", "Heavy solid iron"]] },
  { n: "Solid Thumb Leg – Black 8\"", c: "legs", colours: ["Black"], sizes: ["8 Inches"], specs: [["Material", "Heavy solid iron"]] },
  { n: "Deer Leg – Black 6\"", c: "legs", colours: ["Black"], sizes: ["6 Inches"] },
  { n: "Patta Leg – Black 6\"", c: "legs", colours: ["Black"], sizes: ["6 Inches"], specs: [["Material", "Heavy solid iron"]] },
  { n: "Patta Leg – Black 8\"", c: "legs", colours: ["Black"], sizes: ["8 Inches"], specs: [["Material", "Heavy solid iron"]] },
  { n: "Heavy Cabinet Leg – Black 6\"", c: "legs", colours: ["Black"], sizes: ["6 Inches"], specs: [["Material", "Heavy solid iron"]] },
  { n: "PVC Leg Small – Thread Type 1.5\"", c: "legs", sizes: ["1.5 Inches"], pack: "500 PCS BAG", specs: [["Fitting", "Thread type"], ["Guarantee", "Replacement guarantee"]] },
  { n: "PVC Leg Big – Thread Type 2.5\"", c: "legs", sizes: ["2.5 Inches"], pack: "300 PCS BAG", specs: [["Fitting", "Thread type"], ["Guarantee", "Replacement guarantee"]] },
  { n: "PVC Leg L Shape – Screw Type 2\"", c: "legs", sizes: ["2 Inches"], pack: "250 PCS BAG", specs: [["Fitting", "Screw type"], ["Guarantee", "Replacement guarantee"]] },
  { n: "PVC Leg Square – Screw Type 2.75\"", c: "legs", sizes: ["2.75 Inches"], pack: "250 PCS BAG", specs: [["Fitting", "Screw type"], ["Guarantee", "Replacement guarantee"]] },
  { n: "PVC Leg Square – Screw Type 5\"", c: "legs", sizes: ["5 (4.75) Inches"], specs: [["Fitting", "Screw type"], ["Guarantee", "Replacement guarantee"]] },

  // ---- Other accessories ----
  { n: "Storage Box – Big", c: "other", specs: [["Size", "L14 × W11 × H7 inches"], ["Material", "ABS plastic"], ["Weight", "1 KG (approx.)"], ["Guarantee", "Replacement guarantee"]] },
  { n: "Storage Box – Small", c: "other", specs: [["Size", "L15 × W6 × H4 inches"], ["Guarantee", "Replacement guarantee"]] },

  // ---- Fasteners ----
  { n: "T Nuts 6mm", c: "fasteners", sizes: ["6 MM"] },
  { n: "Staple Pin 8008", c: "fasteners", colours: ["Silver/Chrome"], pack: "7 KG / CRT · 10 BOX IN CRT" },
  { n: "Staple Pin 8009", c: "fasteners", colours: ["Silver/Chrome"], pack: "7 KG / CRT · 10 BOX IN CRT" },
  { n: "Staple Pin 8010 – Silver", c: "fasteners", colours: ["Silver/Chrome"], pack: "7 KG / CRT · 10 BOX IN CRT" },
  { n: "Staple Pin 8010 – Black", c: "fasteners", colours: ["Black"], pack: "7 KG / CRT · 10 BOX IN CRT" },
  { n: "Staple Pin 8012", c: "fasteners", colours: ["Silver/Chrome"], pack: "7 KG / CRT · 10 BOX IN CRT" },
  { n: "Staple Pin 10025", c: "fasteners", colours: ["Silver/Chrome"], pack: "7 KG / CRT" },
  { n: "Staple Pin 10035", c: "fasteners", colours: ["Silver/Chrome"], pack: "7 KG / CRT" },
  { n: "Staple Pin 10040", c: "fasteners", colours: ["Silver/Chrome"], pack: "7 KG / CRT" },
  { n: "Staple Pin 10045", c: "fasteners", colours: ["Silver/Chrome"], pack: "7 KG / CRT" },
  { n: "Staple Pin 10050", c: "fasteners", colours: ["Silver/Chrome"], pack: "7 KG / CRT" },
  { n: "Brad Nails F25", c: "fasteners", pack: "5000 PIN / BOX" },
  { n: "Brad Nails F30/32", c: "fasteners", pack: "5000 PIN / BOX" },
  { n: "Brad Nails F40", c: "fasteners", pack: "5000 PIN / BOX" },
  { n: "Brad Nails F50", c: "fasteners", pack: "5000 PIN / BOX" },
  { n: "Golden Screw (Wood)", c: "fasteners", colours: ["Gold"], pack: "25 KG BAG", specs: [["Sizes", "25 / 32 / 50 / 62 / 75 MM"], ["Use", "Special for wood"]] },
  { n: "Black Screw – High Tember (Wood)", c: "fasteners", colours: ["Black"], pack: "25 KG BAG", specs: [["Sizes", "25 / 32 / 50 / 62 / 75 MM"], ["Use", "Special for wood"]] },
  { n: "Nile Bush", c: "fasteners", pack: "400 PCS PACK" },
  { n: "Plastic Bush (for Metal Legs)", c: "fasteners" },

  // ---- Adhesives & packing ----
  { n: "Stretch Film / Packing Roll – Big Core", c: "adhesives", pack: "6 ROLL IN BOX", specs: [["Micron", "23"], ["Widths", "12 / 18 / 24 / 30 inch"]] },
  { n: "Stretch Film / Packing Roll – Baby Core", c: "adhesives", specs: [["Micron", "23"], ["Widths", "3 / 4 / 6 inch"]] },
  { n: "PVC Golden Strip 25mm (Adhesive)", c: "adhesives", colours: ["Gold"], sizes: ["25 MM"], specs: [["Roll", "50 M"], ["Type", "With adhesive"]] },
  { n: "PVC Golden Strip 32mm (Adhesive)", c: "adhesives", colours: ["Gold"], sizes: ["32 MM"], specs: [["Roll", "50 M"], ["Type", "With adhesive"]] },
  { n: "PVC Golden Strip 50mm (Adhesive)", c: "adhesives", colours: ["Gold"], sizes: ["50 MM"], specs: [["Roll", "50 M"], ["Type", "With adhesive"]] },
  { n: "Yellow 9 Adhesive – Super Bond", c: "adhesives", specs: [["Volume", "4.5 LTR"], ["Use", "Multi-purpose, sprayable"]] },
  { n: "Yellow 4 Adhesive – Super Bond", c: "adhesives", specs: [["Volume", "30 LTR"], ["Use", "Fast bonding, sprayable"], ["Best for", "Sofa"]], feat: true },
  { n: "Yellow 7 Adhesive – Super Bond", c: "adhesives", specs: [["Volume", "30 LTR"], ["Use", "More area, sprayable"], ["Best for", "Mattress"]] },

  // ---- Springs & upholstery components ----
  { n: "Pocketed Spring 18×18×4\"", c: "springs", pack: "15 PCS IN BUNDLE", specs: [["Finish", "All glued, tempered"]] },
  { n: "Pocketed Spring 21×20×4\"", c: "springs", pack: "15 PCS IN BUNDLE", specs: [["Finish", "All glued, tempered"]] },
  { n: "Zig Zag Spring – Imported", c: "springs", sizes: ["4 MM"], pack: "4 KG ROLL · 10 ROLL IN BAG" },
  { n: "Zig Zag Clip – 4 Hole", c: "springs", pack: "3000 PCS BOX" },
  { n: "Zig Zag Clip – 5 Hole", c: "springs", pack: "1800 PCS BOX" },
  { n: "Zig Zag Spring Hook", c: "springs", pack: "250 PCS PACK" },
  { n: "Sofa Button 32mm", c: "springs", sizes: ["32 MM"], pack: "900 PCS PACK" },
  { n: "Sofa Button 36mm", c: "springs", sizes: ["36 MM"], pack: "500 PCS PACK" },
  { n: "Sofa Button 40mm", c: "springs", sizes: ["40 MM"], pack: "500 PCS PACK" },
  { n: "Sofa Metal Button – Gold", c: "springs", colours: ["Gold"], specs: [["Shapes", "Butterfly and oval"]] },
  { n: "Fancy Metal Button – Oval", c: "springs" },
  { n: "Elastic Belt 50mm – 4 Blue Line", c: "springs", colours: ["Black"], specs: [["Width", "50 MM"], ["Length", "25 M (approx.)"], ["Weight", "820 G"]] },
  { n: "Elastic Belt 50mm – 3 Red Line", c: "springs", colours: ["Black"], specs: [["Width", "50 MM"], ["Length", "22.5 M (approx.)"], ["Weight", "1.110 KG"], ["Quality", "Good"]] },
  { n: "Elastic Belt 65mm – 2 Red Line", c: "springs", colours: ["Black"], specs: [["Width", "65 MM"], ["Length", "22.5 M (approx.)"], ["Weight", "1.100 KG"]] },
  { n: "Elastic Belt 70mm – 3 Red Line", c: "springs", colours: ["Black"], specs: [["Width", "70 MM"], ["Length", "22.5 M (approx.)"], ["Weight", "1.510 KG"], ["Quality", "Good"]] },
  { n: "Cotton Niwar 2\"", c: "springs", sizes: ["2 Inches"], pack: "60 KG BAG", specs: [["Roll", "1.50 KG roll (approx.)"]] },
  { n: "Cotton Rope – Twisted 8mm", c: "springs", sizes: ["8 MM"], specs: [["Type", "Normal twisted"], ["Unit", "Sold in KG"]] },
  { n: "Cotton Rope – Braided 4mm", c: "springs", sizes: ["4 MM"], specs: [["Type", "Braided"]] },
  { n: "Cotton Rope – Braided 8mm", c: "springs", sizes: ["8 MM"], specs: [["Type", "Braided"]] },

  // ---- Fabrics & materials ----
  { n: "PU Piping / Bream 4mm", c: "fabrics", sizes: ["4 MM"], specs: [["Roll", "800 M"]] },
  { n: "PU Piping / Bream 5mm", c: "fabrics", sizes: ["5 MM"], specs: [["Roll", "500 M"]], na: true },
  { n: "PU Piping / Bream 6mm", c: "fabrics", sizes: ["6 MM"], specs: [["Roll", "400 M"]] },
  { n: "PU Piping / Bream 8mm", c: "fabrics", sizes: ["8 MM"], specs: [["Roll", "200 M"]] },
  { n: "Golden Piping 6mm", c: "fabrics", colours: ["Gold"], sizes: ["6 MM"], specs: [["Roll", "50 M"]] },
  { n: "Golden Piping 8mm", c: "fabrics", colours: ["Gold"], sizes: ["8 MM"], specs: [["Roll", "50 M"]] },
  { n: "Golden Rexin – Soft Back", c: "fabrics", colours: ["Gold"], specs: [["Type", "Cutting"], ["Roll", "50 M"]] },
  { n: "Polyester Fibre / Recron", c: "fabrics", pack: "5 KG BAG" },
  { n: "Polyester Wadding Sheet 150 GSM", c: "fabrics", specs: [["GSM", "150"], ["Length", "70 M"], ["Width", "60 inch"], ["Quality", "Virgin"]] },
  { n: "Polyester Wadding Sheet 200 GSM", c: "fabrics", specs: [["GSM", "200"], ["Length", "50 M"], ["Width", "60 inch"], ["Quality", "Virgin"]] },
  { n: "Polyester Wadding Sheet 250 GSM", c: "fabrics", specs: [["GSM", "250"], ["Length", "50 M"], ["Width", "60 inch"], ["Quality", "Virgin"]] },
  { n: "Cora Non-Woven Fabric – Light", c: "fabrics", specs: [["GSM", "25 / 30"], ["Roll", "500 M"]] },
  { n: "Cora Non-Woven Fabric – 75 GSM", c: "fabrics", specs: [["GSM", "75"], ["Roll", "250 M"]] },
  { n: "Cora Non-Woven Fabric – Heavy", c: "fabrics", specs: [["GSM", "90 / 100 / 110"], ["Roll", "200 M"]] },
  { n: "Umberla Fabric – Tafta", c: "fabrics", specs: [["Roll", "100 M (approx.)"]] },
  { n: "TRNI Sofa Fabric – Lether Tech", c: "fabrics", specs: [["Packing", "Non-woven"]], na: true },
  { n: "Europa Sofa Fabric – Velvet", c: "fabrics", specs: [["Type", "Shadeable velvet"], ["Packing", "Fleez"], ["Note", "Stock clearing"]] },
  { n: "Zoro Sofa Fabric – Dyed", c: "fabrics", specs: [["Packing", "Non-woven"]], na: true },
  { n: "Adura 6002 – 1st Dyed", c: "fabrics", specs: [["Packing", "Fleez"], ["Quality", "High"]] },
  { n: "Vivaldo 2069 – 1st Dyed", c: "fabrics", specs: [["Packing", "Fleez"], ["Quality", "High"]], feat: true },
  { n: "Noble – Dyed", c: "fabrics", specs: [["Packing", "Fleez"], ["Quality", "High"]] },
  { n: "Pluto – Premium", c: "fabrics", specs: [["Packing", "Fleez"], ["Quality", "Premium"]], nw: true },
  { n: "Zelta – Rexin Tech", c: "fabrics", specs: [["Packing", "Fleez"]], na: true },
  { n: "Steller – Lether Tech", c: "fabrics", specs: [["Packing", "Fleez"], ["Quality", "High"]] },
];

/* ------------------------------------------------------------------ */
/*  Builder                                                            */
/* ------------------------------------------------------------------ */

const colourCode: Record<string, string> = {
  Black: "BLK",
  Gold: "GLD",
  "Silver/Chrome": "SLV",
  "Rose Gold": "RGD",
  "Gun Metal Black": "GMB",
  "Black & Gold": "BKG",
  "Wood & Gold": "WDG",
  "Wooden Finish": "WDN",
  Brown: "BRN",
  Beige: "BGE",
  "Mat Black": "MTB",
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/["'×–—]/g, " ")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function initials(name: string): string {
  const words = name.replace(/[^A-Za-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function sizeCode(label: string): string {
  return label.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 5);
}

// Deterministic pseudo-random 0..1 from a string (so stock is stable across reloads/seeds).
function hashUnit(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

function stockFor(key: string, outOfStock: boolean): number {
  if (outOfStock) return 0;
  const u = hashUnit(key);
  if (u < 0.08) return 0; // ~8% out of stock for realism
  return Math.round(10 + u * 180);
}

const usedSizeLabels = new Set<string>();

const catCode: Record<string, string> = {
  recliner: "REC",
  legs: "LEG",
  fittings: "FIT",
  "chair-bases": "CHR",
  accessories: "CUP",
  springs: "SPR",
  fasteners: "FST",
  fabrics: "FAB",
  adhesives: "ADH",
  other: "OTH",
};

export function buildSeedProducts(): Product[] {
  const now = new Date();
  const slugCount: Record<string, number> = {};
  const catCounters: Record<string, number> = {};

  return RAW.map((raw, idx) => {
    const seq = idx + 1;
    const code = catCode[raw.c] ?? "GEN";
    catCounters[code] = (catCounters[code] || 0) + 1;
    const sku = `MAFT-${code}-${String(catCounters[code]).padStart(3, "0")}`;

    let slug = slugify(raw.n);
    slugCount[slug] = (slugCount[slug] || 0) + 1;
    if (slugCount[slug] > 1) slug = `${slug}-${slugCount[slug]}`;

    const colours = raw.colours ?? [];
    const sizes = raw.sizes ?? [];
    sizes.forEach((s) => usedSizeLabels.add(s));

    const cList = colours.length ? colours : [undefined];
    const sList = sizes.length ? sizes : [undefined];

    const variants: ProductVariant[] = [];
    if (colours.length || sizes.length) {
      for (const cName of cList) {
        for (const sLabel of sList) {
          const parts = [sku];
          if (sLabel) parts.push(sizeCode(sLabel));
          if (cName) parts.push(colourCode[cName] ?? "VAR");
          const vSku = parts.join("-");
          variants.push({
            id: `${sku}-v${variants.length + 1}`,
            productId: sku,
            sku: vSku,
            colourId: cName ? colourByName[cName] : undefined,
            sizeId: sLabel ? `size-${sizeCode(sLabel)}` : undefined,
            stockQuantity: stockFor(vSku, !!raw.na),
            isActive: true,
          });
        }
      }
    }

    const hasVariants = variants.length > 1;
    const category = seedCategories.find((c) => c.slug === `${raw.c}` || c.id === catSlug(raw.c));
    const categoryId = seedCategories.find((c) => c.id === catSlug(raw.c))?.id ?? category?.id ?? "cat-other";

    const specifications = (raw.specs ?? []).map(([key, value]) => ({ key, value }));

    const shortBits: string[] = [];
    if (colours.length) shortBits.push(colours.join(" / "));
    if (sizes.length) shortBits.push(sizes.join(" / "));
    const shortDescription = shortBits.length
      ? `Available in ${shortBits.join(", ")}.`
      : `Quality ${raw.n.toLowerCase()} from MAFT MARKETING.`;

    const description =
      `${raw.n} supplied by MAFT MARKETING, Manjeri. ` +
      (raw.pack ? `Standard packing: ${raw.pack}. ` : "") +
      `Contact us on WhatsApp to confirm current price, availability and bulk options.`;

    const singleStock = variants.length === 0 ? stockFor(sku, !!raw.na) : 0;

    const createdAt = new Date(now.getTime() - (RAW.length - idx) * 36e5).toISOString();

    return {
      id: sku,
      name: raw.n,
      slug,
      sku,
      categoryId,
      shortDescription,
      description,
      imageLabel: initials(raw.n),
      hasVariants,
      variants,
      specifications,
      packingInfo: raw.pack,
      stockQuantity: singleStock,
      isActive: true,
      isFeatured: !!raw.feat,
      isNewArrival: !!raw.nw,
      sortOrder: seq,
      createdAt,
      updatedAt: createdAt,
    };
  });
}

export function buildSeedSizes(): Size[] {
  // Curated base order so common leg sizes sort naturally.
  const order = [
    "1.5 Inches", "2 Inches", "2.5 Inches", "2.75 Inches", "3 Inches", "4 Inches",
    "5 Inches", "5 (4.75) Inches", "6 Inches", "7 Inches", "8 Inches", "10 Inches",
    "14 Inches", "15 Inches", "15.5 Inches", "16 Inches", "17 Inches", "18 Inches",
    "6+2 Inches", "7+2 Inches", "4-6 Inches", "5-8 Inches", "6-10 Inches",
    "4 MM", "5 MM", "6 MM", "8 MM", "25 MM", "32 MM", "36 MM", "40 MM", "50 MM",
    "22.5 CM", "25 CM", "28 CM", "30 CM", "90 CM", "120 CM",
  ];
  const labels = new Set<string>([...usedSizeLabels, ...order]);
  // Ensure usedSizeLabels is populated even if build order differs.
  if (usedSizeLabels.size === 0) buildSeedProducts();
  for (const l of usedSizeLabels) labels.add(l);

  return [...labels].map((label, i) => ({
    id: `size-${sizeCode(label)}`,
    label,
    value: sizeValueFor(label),
    unit: sizeUnitFor(label),
    sortOrder: order.indexOf(label) === -1 ? 100 + i : order.indexOf(label),
    isActive: true,
  })).sort((a, b) => a.sortOrder - b.sortOrder);
}

export const seedSettings: Settings = {
  businessName: "MAFT MARKETING",
  tagline: "Your Trusted Partner",
  address: "Manjeri, Malappuram, Kerala",
  phonePrimary: "+91 9495455929",
  phoneSecondary: "+91 9656764964",
  whatsappNumber: "919048687010",
  showStock: true,
  productsPerPage: 16,
};

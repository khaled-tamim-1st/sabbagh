/**
 * Comprehensive Kuwait Painting & Decoration Services Data (English Edition)
 * Tailored for Expats, Property Managers, and English-speaking Homeowners in Kuwait.
 *
 * All pricing is anchored in Kuwaiti Dinar (KWD), reflecting realistic market rates
 * from Shuwaikh building materials market and certified Jotun/Caparol applicators.
 */

export interface ServicePriceEn {
  unit: string;               // e.g. 'per standard room (4×5m)', 'per m²', 'per roll (16.5 m²)', 'per panel'
  fromKWD: number;            // Minimum price in KWD
  toKWD: number;              // Maximum price in KWD
  averageKWD: number;         // Estimated average in KWD
  pricingModel: 'room' | 'sqm' | 'roll' | 'panel' | 'project';
  includesMaterials: boolean; // Does it include genuine paints and putty
  notesEn: string;            // Transparency notes on pricing
}

export interface ServiceFaqEn {
  question: string;
  answer: string;
}

export interface KuwaitServiceEn {
  id: string;
  slug: string;
  title: string;
  shortName: string;
  category: 'interior' | 'decorative' | 'wallpaper' | 'cladding' | 'repair' | 'exterior' | 'flooring' | 'woodwork' | 'insulation';
  categoryLabelEn: string;
  tagline: string;
  description: string;
  whyInKuwait: string;        // Local Kuwait context (climate, dust, AC humidity)
  popularBrands: string[];    // Approved paint brands in Kuwait
  price: ServicePriceEn;
  features: string[];
  executionTime: string;      // Expected timeline
  executionSteps: string[];   // Step-by-step professional process
  expertAdvice: string[];     // Practical tips for consumers in Kuwait
  recommendedAreas: string[]; // Suitable spaces
  faqs: ServiceFaqEn[];
}

export const KUWAIT_SERVICES_DATA_EN: KuwaitServiceEn[] = [
  {
    id: 'interior-paints',
    slug: 'interior-painting',
    title: 'Interior Wall & Ceiling Painting (Matt, Eggshell, Silk)',
    shortName: 'Interior Painting',
    category: 'interior',
    categoryLabelEn: 'Interior Wall & Ceiling Painting',
    tagline: 'Professional villa and apartment repainting with genuine Jotun Fenomastic & Caparol paints',
    description: 'Complete interior wall and ceiling restoration for homes, apartments, and luxury villas across Kuwait. Our service covers complete surface preparation, multi-coat putty skim coating (2-3 knife coats), machine dustless sanding with vacuum extractors, water-based acrylic primer, and two finish coats of authentic Jotun Fenomastic Pure Colours.',
    whyInKuwait: 'In Kuwait homes, Eggshell (Quarter-Gloss / semi-matt) is the most sought-after finish for living rooms and kids bedrooms because it can withstand regular washing and scrubbing against summer dust storms. Silk and matt finishes are preferred for ceilings and reception salons to deliver a non-reflective, elegant look.',
    popularBrands: ['Jotun Fenomastic Pure Colours', 'Caparol Kuwait', 'National Paints', 'Hempel Kuwait'],
    price: {
      unit: 'per standard room (4×5m)',
      fromKWD: 18,
      toKWD: 32,
      averageKWD: 25,
      pricingModel: 'room',
      includesMaterials: true,
      notesEn: 'Price includes genuine Jotun paint, putty, masking tapes, floor plastic protection, and complete clean-up. Whole apartment or villa packages receive discount tiers.',
    },
    features: [
      'Comprehensive plastic wrapping for furniture, floors, and electrical fixtures',
      'Dustless mechanized wall sanding capturing 90% of airborne particles',
      'Eco-friendly, low-VOC, odorless paints safe for immediate room occupancy',
      'Precision matching of official Jotun color codes (e.g., Breeze, Bare, Twilight, Macchiato)',
      'Written guarantee against peeling, blistering, and color fading',
    ],
    executionTime: '1 day per standard room, 3 to 5 days for full 3-bedroom apartment',
    executionSteps: [
      'Furniture grouping in the center and protective nylon/taping of floors',
      'Scraping loose old paint, clearing cracks, and surface cleaning',
      'Applying two skim coats of high-strength acrylic wall putty with mechanical sanding',
      'Applying penetrating acrylic primer sealer to optimize adhesion',
      'Applying first coat of Jotun Fenomastic and allowing 3 hours cure',
      'Applying second finish coat, touch-ups, edge trimming, and site cleanup',
    ],
    expertAdvice: [
      'Always inspect paint swatches under both natural morning light and evening warm/white spotlights before final approval.',
      'For rented apartments in Salmiya or Hawalli, eggshell finishes help recover your security deposit since scuffs wipe off easily.',
      'Avoid heavy oil-based gloss paints in occupied bedrooms; opt for modern water-based Fenomastic Pure formulations.',
    ],
    recommendedAreas: ['Living Rooms & Salons', 'Master & Guest Bedrooms', 'Kids Rooms', 'Corridors & Gypsum Ceilings'],
    faqs: [
      {
        question: 'What is the price of painting a 3-bedroom apartment in Kuwait?',
        answer: 'A standard 3-bedroom apartment with a hall and hallway typically ranges between 85 to 140 KWD, including authentic Jotun paints, putty prep, and full floor protection. The work takes 3-5 days.',
      },
      {
        question: 'Can you provide an English-speaking coordinator for the inspection?',
        answer: 'Yes, our platform connects you with painters and supervisors fluent in English who conduct free on-site inspections anywhere in Kuwait and communicate clearly via WhatsApp.',
      },
      {
        question: 'What is the difference between Matt, Eggshell, and Semi-Gloss?',
        answer: 'Matt conceals wall imperfections and eliminates glare (ideal for ceilings and master bedrooms). Eggshell offers low-luster elegance with high washability (most popular for Kuwait living rooms). Semi-Gloss provides maximum moisture resistance for kitchens and bathrooms.',
      },
    ],
  },
  {
    id: 'italian-decorative',
    slug: 'italian-decorative-paints',
    title: 'Italian Decorative Paints & Stucco (Travertino, Marmorino, Valpaint)',
    shortName: 'Italian Decorative Paints',
    category: 'decorative',
    categoryLabelEn: 'Luxury Decorative Wall Finishes',
    tagline: 'Authentic stone, marble, and velvet silk finishes for reception halls, villas, and feature walls',
    description: 'Transform ordinary walls into architectural works of art with genuine Italian lime-based plaster and metallic glazes. Executed by master trowel craftsmen specialized in Italian Travertino (limestone texture), Marmorino (honed marble), Stucco Antico (mirror-polished Venetian plaster), and Valpaint velvet luxury effects.',
    whyInKuwait: 'Italian mineral plasters are breathable, naturally mold-resistant, and withstand continuous heavy air conditioning without deteriorating. They add immense property value and elegance to Kuwaiti Diwaniyas, luxury reception areas, and hotel-standard master suites.',
    popularBrands: ['San Marco (Italy)', 'Novacolor (Italy)', 'Oikos', 'Valpaint Original', 'Jotun Lady Design'],
    price: {
      unit: 'per square meter (m²)',
      fromKWD: 4.5,
      toKWD: 9,
      averageKWD: 6.5,
      pricingModel: 'sqm',
      includesMaterials: true,
      notesEn: 'Final price depends on texture depth and number of trowel passes. A 20 m² feature wall typically costs 90 to 130 KWD all-inclusive.',
    },
    features: [
      'Authentic cool marble or limestone tactile feel, highly scratch-resistant',
      'Natural mineral lime composition preventing mold, humidity, and bacterial growth',
      'Coated with protective Italian beeswax or clear glaze for easy wet wipe cleaning',
      'Enduring luxury lasting 10+ years without peeling or yellowing',
    ],
    executionTime: '2 to 4 days depending on drying stages between plaster layers',
    executionSteps: [
      'Leveling the base wall with fiber-reinforced smoothing compound',
      'Applying specialized quartz adhesion primer (Fond Abrasivo)',
      'First pass of Italian lime plaster using stainless steel Venetian trowels',
      'Second layer sculpted with directional textures (Travertino stone vein effect)',
      'Burnishing and polishing with protective beeswax or metallic patina sealers',
    ],
    expertAdvice: [
      'Never apply Venetian stucco on a wall suffering from water leakage or dampness; waterproof first.',
      'Use recessed 3000K warm LED grazing lights above textured walls to highlight the 3D depth of Italian craftsmanship.',
    ],
    recommendedAreas: ['Diwaniya Reception Walls', 'Villa Entrance Foyers', 'Dining Feature Walls', 'Luxury Penthouse Salons'],
    faqs: [
      {
        question: 'Can Italian Stucco be cleaned with water?',
        answer: 'Yes, once sealed with Italian protective wax (Cera Naturale) or polyurethane glaze, the surface becomes water-repellent and can be gently wiped with a damp microfiber cloth.',
      },
      {
        question: 'How much does an Italian Stucco accent wall cost in Kuwait?',
        answer: 'An accent wall measuring 4x3 meters (12 m²) usually costs between 60 and 85 KWD including genuine Italian imported materials and artisan labor.',
      },
    ],
  },
  {
    id: 'wallpapers-3d',
    slug: 'wallpapers-3d',
    title: 'Wallpaper Installation & 3D Feature Murals',
    shortName: 'Wallpaper Installation',
    category: 'wallpaper',
    categoryLabelEn: 'Wall Coverings & Custom Murals',
    tagline: 'Flawless installation of luxury Korean, European, and custom 3D wallpapers with zero air bubbles',
    description: 'Expert wallpaper hanging and removal services across all Kuwait areas. We handle high-density vinyl, non-woven textured wallpapers, hotel-grade heavy Korean coverings (1.06m wide), fabric-backed textiles, and bespoke 3D panoramic murals. Flawless pattern matching with mold-inhibiting German adhesive.',
    whyInKuwait: 'Korean vinyl wallpapers are widely favored in Kuwait apartments and villas due to their durability against dry heat and seamless 1.06-meter rolls that reduce visible seams by 50% compared to standard European rolls.',
    popularBrands: ['Korean LG Hausys & Shinhan', 'Marburg (Germany)', 'Rasch', 'Grandeco (Belgium)', 'Metylan Henkel Glue'],
    price: {
      unit: 'per roll (16.5 m² Korean roll) / per standard wall',
      fromKWD: 4,
      toKWD: 8,
      averageKWD: 6,
      pricingModel: 'roll',
      includesMaterials: false,
      notesEn: 'Labor only: 4-6 KWD per roll with premium German glue included. Complete supply and install ranges from 18 to 35 KWD per roll.',
    },
    features: [
      'Precision laser alignment for straight vertical lines and invisible seams',
      'German anti-fungal adhesive preventing mold growth behind wallpaper',
      'Smooth bubble-free smoothing with silicone rollers and specialized brushes',
      'Clean removal of existing old wallpaper without damaging underlying drywall',
    ],
    executionTime: '2 to 4 hours per room (average 3-4 rolls)',
    executionSteps: [
      'Inspecting wall smoothness, scraping old paint imperfections, and applying oil primer',
      'Laser measuring and batch-checking roll pattern match numbers',
      'Even glue roller application on wall or paper backing',
      'Hanging panels with overlap trimming and silicone seam roller sealing',
      'Precision knife trimming along ceiling cornices and baseboards',
    ],
    expertAdvice: [
      'Always buy 10-15% extra wallpaper for pattern repeats and future repairs.',
      'Never install paper-backed wallpaper in unventilated bathrooms or high-humidity coastal balconies.',
    ],
    recommendedAreas: ['Bedroom Bedhead Walls', 'Living Room Accent Walls', 'Dining Rooms', 'Powder Rooms & Offices'],
    faqs: [
      {
        question: 'How much does it cost to install one roll of Korean wallpaper in Kuwait?',
        answer: 'Labor installation with glue costs around 4 to 6 KWD per Korean roll (16.5 sqm, equivalent to 3 standard rolls).',
      },
      {
        question: 'Will removing wallpaper damage my walls?',
        answer: 'Our technicians use professional steam machines and softening solvents that peel paper smoothly without chipping your plaster.',
      },
    ],
  },
  {
    id: 'cladding-panels',
    slug: 'pvc-marble-wpc-wood-fluted-panels',
    title: 'PVC Marble Sheets & WPC Fluted Wood Panels',
    shortName: 'PVC Marble & Wood Cladding',
    category: 'cladding',
    categoryLabelEn: 'Modern Wall Cladding & TV Units',
    tagline: 'Contemporary TV background units, luxury marble-look sheets, and acoustic wood slats with hidden LED profiles',
    description: 'Transform plain walls into modern luxury focal points using lightweight PVC faux marble panels (122×280 cm) paired with fluted WPC composite wood slats and hidden warm LED profile channels. 100% waterproof, termite-proof, fire-retardant, and installed in hours with zero demolition mess.',
    whyInKuwait: 'Real natural marble slabs are heavy, costly (35-70 KWD/m²), and vulnerable to Kuwait water stains. PVC marble panels provide the exact high-gloss veined look of Calacatta or Nero Marquina at a fraction of the cost, making them the top trend in Kuwait living rooms.',
    popularBrands: ['Korean High-Gloss PVC UV Sheet', 'WPC Composite Fluted Slats', 'Hafele / Lumiled Aluminum LED Channels'],
    price: {
      unit: 'per sheet (122×280 cm) including glue and silicone',
      fromKWD: 12,
      toKWD: 22,
      averageKWD: 16,
      pricingModel: 'panel',
      includesMaterials: true,
      notesEn: 'Standard TV backdrop (1 PVC marble sheet + 4 fluted wood panels + LED channel) costs around 55 - 90 KWD fully installed.',
    },
    features: [
      '100% waterproof and moisture resistant, ideal for damp or AC-prone walls',
      'Ultra-fast installation in 3-6 hours with zero dust or wall demolition',
      'UV protective coating resisting color fading from Kuwait sunlight',
      'Seamless integration with wall-mounted TVs, soundbars, and hidden wiring',
    ],
    executionTime: 'Half day to 1 full day for complete TV unit or reception wall',
    executionSteps: [
      'Wall inspection and laser marking of TV mounting brackets and wiring channels',
      'Cutting panels to ceiling height with fine carbide circular saws',
      'Applying high-tack hybrid polymer adhesive (Soudal / Tremco)',
      'Mounting WPC fluted panels with concealed interlocking brackets',
      'Installing aluminum LED profiles, diffuser covers, and edge corner trims',
    ],
    expertAdvice: [
      'Coordinate with your electrician to run HDMI and power cables inside the wall before cladding.',
      'Match warm gold or copper edge trims with Calacatta Gold marble for a warm modern aesthetic.',
    ],
    recommendedAreas: ['TV Accent Walls', 'Foyer & Reception Entrances', 'Diwaniya Focal Walls', 'Corridors & Bed Backboards'],
    faqs: [
      {
        question: 'How much does a full modern TV wall unit cost in Kuwait?',
        answer: 'A standard 3-meter TV unit with a central PVC marble sheet, fluted side wood panels, and warm LED strip lighting typically costs 65 to 110 KWD all-inclusive.',
      },
      {
        question: 'Is PVC marble resistant to scratches and heat?',
        answer: 'Yes, premium Korean PVC marble sheets have a UV-cured acrylic topcoat that protects against scratches and daily cleaning chemicals.',
      },
    ],
  },
  {
    id: 'moisture-treatment',
    slug: 'moisture-humidity-cracks-treatment',
    title: 'Wall Moisture, Salt Dampness & Crack Repair',
    shortName: 'Moisture & Crack Repair',
    category: 'repair',
    categoryLabelEn: 'Wall Restoration & Waterproofing',
    tagline: 'Permanent engineering solutions for bubbling paint, efflorescence salts, basement dampness, and hairline cracks',
    description: 'Guaranteed remediation for Kuwait homes suffering from peeling paint, white powdery salt blooms (efflorescence), coastal humidity damage, and seasonal thermal settling cracks. We treat root causes with deep-penetrating silane primers, elastomeric crack sealants, and breathable waterproof barrier coats.',
    whyInKuwait: 'High groundwater in southern Kuwait (Fahaheel, Mangaf, Sabah Al-Ahmad) combined with extreme humidity along Gulf coastal areas causes salt to leach through concrete blocks, disintegrating normal wall putty within months if not chemically sealed.',
    popularBrands: ['Sika Kuwait (Sikagard & SikaTop)', 'Caparol Dupa-Putzgrund', 'Jotun Barrier Primer', 'Fosroc Nitoproof'],
    price: {
      unit: 'per damaged wall or meter treatment',
      fromKWD: 15,
      toKWD: 45,
      averageKWD: 25,
      pricingModel: 'project',
      includesMaterials: true,
      notesEn: 'Pricing depends on dampness severity and whether basement waterproofing is required. Includes a 2-year warranty against recurring peel.',
    },
    features: [
      'Deep chemical scraping down to bare masonry block or concrete',
      'Neutralizing alkaline salts with specialized chemical washing agents',
      'Application of hydrophobic crystalline waterproofing barrier',
      'Reinforced fiberglass mesh over moving settling cracks',
      'Moisture-resistant hydraulic skim coating with guaranteed topcoat',
    ],
    executionTime: '2 to 3 days to allow chemical crystallization and drying',
    executionSteps: [
      'Thermal/moisture detection to identify the water source (AC pipe, roof, groundwater)',
      'Aggressive scraping of all blistered paint and damaged plaster',
      'Chemical salt neutralization treatment and wire brush scrubbing',
      'Applying Sika deep penetrating hydrophobic waterproofing barrier',
      'Installing fiber mesh over structural cracks with flexible elastomeric compound',
      'Applying moisture-resistant exterior/interior grade finish coat',
    ],
    expertAdvice: [
      'Never just paint over bubbling or peeling paint; unless the salt is neutralized, it will peel again within 60 days.',
      'Check AC drain pipes on the roof or outer walls, as 70% of wall moisture in Kuwait comes from cracked plastic AC condensation drains.',
    ],
    recommendedAreas: ['Basement Walls & Retaining Foundations', 'Walls Adjacent to Bathrooms/Kitchens', 'Ground Floor Skirting Lines', 'Coastal Villas in Salmiya & Fintas'],
    faqs: [
      {
        question: 'Why does wall paint peel near the floor in Kuwait apartments?',
        answer: 'This is capillary rising damp (efflorescence) where moisture and salts rise from ground slabs or subfloor washing, pushing standard putty off the wall. It requires crystalline barrier sealing.',
      },
      {
        question: 'Do you offer a guarantee against recurring dampness?',
        answer: 'Yes, our moisture repair systems include up to 2 years warranty against bubbling or peeling when root causes are fully addressed.',
      },
    ],
  },
  {
    id: 'exterior-facade',
    slug: 'exterior-facade-sigma-jotun',
    title: 'Exterior Facade Painting & Sigma Weatherproof Coating',
    shortName: 'Exterior Facade & Sigma',
    category: 'exterior',
    categoryLabelEn: 'Exterior Villa & Building Coatings',
    tagline: 'Extreme weather-resistant exterior finishes, Sigma textured acrylic, and Jotun Jotashield Extreme 50°C+ protection',
    description: 'Heavy-duty exterior facade restoration, texture spraying, and thermal reflective painting for Kuwait villas, commercial buildings, and chalets. We apply certified Sigma acrylic texture, American roughcast (Nathri), and Jotun Jotashield Extreme heat-reflective coatings designed to resist intense UV rays, dust storms, and Gulf coastal salinity.',
    whyInKuwait: 'Kuwait summer temperatures surpass 50°C with severe UV index (11+). Low-grade exterior paint fades, cracks, and flakes within one summer. Jotun Jotashield Extreme reduces exterior wall temperature by up to 5°C, lowering indoor air conditioning power consumption.',
    popularBrands: ['Sigma Coatings (PPG)', 'Jotun Jotashield Extreme & Tex Ultra', 'Caparol Muresko', 'Hempel Topaz Exterior'],
    price: {
      unit: 'per square meter (m²) of facade area',
      fromKWD: 1.8,
      toKWD: 4.5,
      averageKWD: 2.8,
      pricingModel: 'sqm',
      includesMaterials: true,
      notesEn: 'Price includes high-pressure water blasting, crack sealing, primer, and scaffolding setup for standard 2-3 floor residential villas.',
    },
    features: [
      'UV-reflective pigments lowering exterior concrete surface heat',
      'High-build flexible acrylic bridges hairline masonry settling cracks',
      'Anti-carbonation and salt-spray barrier for coastal and desert conditions',
      'Safe heavy scaffolding and motorized cradles for multi-story buildings',
      'Certified 10-year manufacturer warranty on Jotun Jotashield Extreme',
    ],
    executionTime: '7 to 14 days for a complete villa exterior',
    executionSteps: [
      'High-pressure power washing (250 bar) to strip dust, oxidized paint, and dirt',
      'V-cutting exterior cracks and sealing with exterior polyurethane mastic',
      'Applying deep-penetrating siloxane exterior primer',
      'Spraying or troweling Sigma acrylic texture coat to desired grain size',
      'Applying two coats of Jotashield Extreme UV-resistant topcoat',
    ],
    expertAdvice: [
      'Never apply exterior paint during Kuwait summer midday hours (11 AM - 3 PM); work is executed in early morning or late afternoon to prevent rapid flashing.',
      'In seaside areas like Khiran or Bneid Al-Gar, always specify marine-grade polyurethane topcoats.',
    ],
    recommendedAreas: ['Villa Outer Facades', 'Boundary Walls & Gates', 'Chalet Exteriors in Khiran', 'Commercial Building Frontages'],
    faqs: [
      {
        question: 'How much does it cost to repaint a typical 2-story villa exterior in Kuwait?',
        answer: 'Repainting a standard 750 m² villa facade with pressure washing, crack repairs, and Jotun Jotashield typically costs between 1,200 to 2,200 KWD, depending on scaffolding and texture type.',
      },
      {
        question: 'What is the lifespan of Sigma coating in Kuwait?',
        answer: 'Genuine Jotun or Sigma acrylic textured coating lasts between 10 to 15 years without cracking or peeling when properly primed.',
      },
    ],
  },
  {
    id: 'epoxy-flooring',
    slug: 'epoxy-flooring',
    title: 'Epoxy Flooring (Garages, Basements, Commercial Warehouses)',
    shortName: 'Epoxy Flooring',
    category: 'flooring',
    categoryLabelEn: 'Industrial & Residential Floor Coatings',
    tagline: 'Seamless, high-gloss, chemical-resistant epoxy floors for private garages, basements, workshops, and clinics',
    description: 'Heavy-duty seamless epoxy and polyurethane resin flooring solutions. We specialize in diamond diamond-grinding surface prep, moisture vapor barrier primers, self-leveling commercial epoxy, decorative color quartz flakes, and metallic marble designer epoxy for private villas, car basements, and retail showrooms.',
    whyInKuwait: 'Unsealed concrete garages in Kuwait generate constant powdery cement dust that ruins vehicle paint and gets tracked inside homes. Epoxy creates an impenetrable, mirror-clean surface impervious to hot tire pickup, car oil leaks, and battery acid.',
    popularBrands: ['Jotun Penguard / Hardtop', 'Sika SikaFloor', 'Fosroc Nitoflor', 'Flowcrete'],
    price: {
      unit: 'per square meter (m²)',
      fromKWD: 3.5,
      toKWD: 8.5,
      averageKWD: 5.5,
      pricingModel: 'sqm',
      includesMaterials: true,
      notesEn: 'Standard 2-car villa garage (35 m²) costs approximately 130 to 190 KWD with full diamond mechanical grinding preparation included.',
    },
    features: [
      'Heavy load tolerance withstanding SUV parking and mechanical jacks',
      'Hot-tire pick up resistance (will not peel when hot summer tires park on it)',
      '100% dust-free, seamless, and stain-resistant to engine oil, brake fluid, and gasoline',
      'Custom safety demarcation lines, parking bays, and non-slip quartz aggregate textures',
    ],
    executionTime: '2 to 3 days plus 48 hours curing time for vehicle traffic',
    executionSteps: [
      'Diamond grinding concrete to CSP-3 profile with industrial HEPA dust vacuum',
      'Routing and filling concrete control joints with flexible polyurea filler',
      'Applying 100% solids epoxy penetrating primer',
      'Applying self-leveling epoxy body coat with notched squeegees and spike rollers',
      'Applying chemical-resistant aliphatic polyurethane topcoat for UV stability',
    ],
    expertAdvice: [
      'Do not park cars on newly applied epoxy for at least 72 hours in winter and 48 hours in summer.',
      'Always test new concrete slabs for hydrostatic moisture before coating.',
    ],
    recommendedAreas: ['Private Car Garages & Carports', 'Villa Basements & Storage Rooms', 'Commercial Warehouses in Shuwaikh/Rai', 'Clinics, Salons & Gyms'],
    faqs: [
      {
        question: 'Will hot car tires peel the epoxy floor in Kuwait summers?',
        answer: 'No. We use industrial 100% solids epoxy and diamond grinding that bonds mechanically to the slab, preventing hot-tire delamination even at 50°C.',
      },
      {
        question: 'How long does a garage epoxy floor last?',
        answer: 'A professionally installed epoxy floor in a private residential garage typically lasts 10 to 15 years with basic mopping maintenance.',
      },
    ],
  },
  {
    id: 'doors-painting',
    slug: 'doors-wood-painting',
    title: 'Doors & Woodwork Spray Painting (Duco, Polyurethane, Lacquer)',
    shortName: 'Door & Woodwork Painting',
    category: 'woodwork',
    categoryLabelEn: 'Interior & Exterior Wood Coating',
    tagline: 'High-velocity HVLP spray refinishing for room doors, kitchen cabinets, and entrance gates',
    description: 'Breathe new life into faded, scratched, or dated interior room doors without costly replacement. We provide factory-grade spray finishes including Italian polyurethane lacquer, high-gloss Duco (automotive-style spray), satin wood stains, and weather-resistant enamel for villa entrance doors and wrought iron gates.',
    whyInKuwait: 'Replacing a solid wood or semi-solid door in Kuwait costs between 60 to 150 KWD per unit. Spray refinishing restores doors to brand-new condition for only 12-25 KWD, delivering significant savings on villa renovations.',
    popularBrands: ['Sayerlack (Italy)', 'Milesi Wood Coatings', 'Caparol Capacryl', 'National Duco'],
    price: {
      unit: 'per door (both faces + door jamb frame)',
      fromKWD: 12,
      toKWD: 25,
      averageKWD: 18,
      pricingModel: 'project',
      includesMaterials: true,
      notesEn: 'Includes handle removal, lock masking, sanding, spray primer, and 2 spray coats. Minimum order is 3 doors.',
    },
    features: [
      'Ultra-smooth spray finish with zero brush or roller marks',
      'Hard, scratch-resistant Italian polyurethane coats that wipe clean effortlessly',
      'Custom color transformation (e.g., converting dark walnut brown doors to modern Off-White or Greige)',
      'Protection and masking of locks, hinges, and luxury door hardware',
    ],
    executionTime: '1 to 2 days for 6-10 doors',
    executionSteps: [
      'Removing door hardware and masking adjacent walls and floor tiles',
      'Sanding old varnish to create mechanical tooth for new lacquer',
      'Filling dents, scratches, and gouges with specialized polyester wood filler',
      'Applying high-build polyurethane spray primer',
      'Spraying two topcoats with HVLP turbines for an ultra-fine, even finish',
    ],
    expertAdvice: [
      'Change dated brass handles to modern matte black or brushed nickel after door repainting for an immediate modern transformation.',
      'For villa front doors facing the afternoon sun, specify UV-absorber marine polyurethane varnishes.',
    ],
    recommendedAreas: ['Room & Bedroom Doors', 'Kitchen Cabinet Fronts', 'Main Villa Entrance Doors', 'Wrought Iron Window Grilles & Gates'],
    faqs: [
      {
        question: 'Can dark brown wood doors be painted modern off-white?',
        answer: 'Yes! We apply high-opacity polyurethane blocking primers that completely mask dark grain before spraying pure off-white or light grey lacquer.',
      },
      {
        question: 'Do you paint doors inside the apartment or take them to a workshop?',
        answer: 'We spray doors on-site inside a portable negative-pressure spray booth with exhaust filtration to keep your home completely clean.',
      },
    ],
  },
  {
    id: 'microcement',
    slug: 'microcement-coatings',
    title: 'Microcement & Seamless Concrete Finishes',
    shortName: 'Microcement Finishes',
    category: 'decorative',
    categoryLabelEn: 'Modern Seamless Mineral Finishes',
    tagline: 'Continuous, grout-free concrete aesthetic for modern bathrooms, kitchens, and architectural villas',
    description: 'Cutting-edge microcement applications for floors, walls, showers, and countertops. Only 2-3 mm thin yet extraordinarily strong, creating a continuous industrial chic aesthetic without a single grout line. Fully waterproof, slip-resistant, and applied directly over existing tiles without demolition.',
    whyInKuwait: 'Modern Kuwait villas and chalets in Khiran and Messila are shifting from traditional ceramic tiles with dirty grout lines to seamless microcement for a clean, minimalist European spa atmosphere.',
    popularBrands: ['Topciment (Spain)', 'Ideal Work (Italy)', 'CimentArt', 'SikaDeco'],
    price: {
      unit: 'per square meter (m²)',
      fromKWD: 8,
      toKWD: 18,
      averageKWD: 13,
      pricingModel: 'sqm',
      includesMaterials: true,
      notesEn: 'Pricing includes fiber mesh reinforcing, 3 microcement passes, and waterproof polyurethane sealing. Bathroom renovations start from 160 KWD.',
    },
    features: [
      'Applied directly over old bathroom ceramics with zero demolition dust',
      '100% waterproof and continuous with no grout lines to accumulate mildew',
      'Ultra-thin 3mm profile with zero impact on door clearance or floor levels',
      'Available in warm grey, greige, ivory, sand, and charcoal tones',
    ],
    executionTime: '4 to 6 days due to multi-layer resin curing stages',
    executionSteps: [
      'Tile degreasing and applying high-bond quartz epoxy adhesion promoter',
      'Embedding alkaline-resistant fiberglass mesh in microcement base coat',
      'Applying second smoothing base layer followed by two fine aesthetic coats',
      'Hand sanding to reveal subtle mineral burnish movements',
      'Applying two coats of heavy-duty matte aliphatic polyurethane sealer',
    ],
    expertAdvice: [
      'Microcement is perfect for master bathroom remodels because you do not have to break existing tiles or disturb under-tile plumbing.',
    ],
    recommendedAreas: ['Luxury Bathrooms & Walk-in Showers', 'Chalet Living Floors', 'Modern Kitchen Countertops', 'Retail Boutique Stores'],
    faqs: [
      {
        question: 'Can microcement be applied directly over my existing bathroom tiles in Kuwait?',
        answer: 'Yes! Our high-adhesion epoxy primers bridge directly to ceramic and porcelain tiles, completely hiding grout lines without removing tiles.',
      },
      {
        question: 'Is microcement slippery when wet in showers?',
        answer: 'No. The polyurethane sealers are formulated with micro-grip additives that ensure safe anti-slip performance in wet walk-in showers.',
      },
    ],
  },
  {
    id: 'gypsum-board',
    slug: 'gypsum-board-decorations',
    title: 'Gypsum Board Partitions & Suspended Ceilings',
    shortName: 'Gypsum Board & Ceilings',
    category: 'interior',
    categoryLabelEn: 'Drywall Partitioning & False Ceilings',
    tagline: 'Custom acoustic office partitions, shadow-gap false ceilings, and modern TV wall alcoves',
    description: 'Complete drywall solutions for apartments, office fit-outs, and residential villas. We install moisture-resistant green gypsum boards for bathrooms, fire-rated pink boards for kitchens, sound-insulated stud partitions with rockwool, floating ceilings with shadow line profiles, and customized media walls.',
    whyInKuwait: 'In Kuwait commercial towers (Sharq, Qibla) and shared residential flats, gypsum board provides quick, council-approved space partitioning with superior thermal and acoustic comfort without structural slab loading.',
    popularBrands: ['Knauf (Germany)', 'Gypsemna (UAE)', 'Mada Gypsum', 'USG Boral'],
    price: {
      unit: 'per square meter (m²) installed with framing and tape',
      fromKWD: 3.5,
      toKWD: 7.5,
      averageKWD: 5,
      pricingModel: 'sqm',
      includesMaterials: true,
      notesEn: 'Price includes galvanized steel stud frames, gypsum boards, joint tape, and screw-hole filling ready for final paint.',
    },
    features: [
      'Heavy-gauge galvanized steel framework resisting sag and deflection',
      'Moisture-resistant boards (green) preventing sagging in humid bathrooms and kitchens',
      'Integrated shadow line gap profiles for architectural modern lighting',
      'Clean cutting and vacuum clean-up of gypsum powder during execution',
    ],
    executionTime: '1 to 3 days for partition walls or room ceilings',
    executionSteps: [
      'Laser setting of floor, ceiling, and wall guide channels',
      'Anchoring vertical C-studs at 40cm centers with vibration dampeners',
      'Inserting high-density acoustic rockwool sound insulation batts',
      'Fastening gypsum sheets with bugle-head drywall screws',
      'Taping joints with perforated paper tape and three coats of joint compound',
    ],
    expertAdvice: [
      'Always install horizontal wooden or steel backing noggins where you plan to hang heavy TV screens or kitchen wall cabinets.',
    ],
    recommendedAreas: ['Office Space Partitions', 'False Ceilings with Indirect LED Cove', 'Bathroom Ceilings with Access Panels', 'Modern TV Display Niches'],
    faqs: [
      {
        question: 'How long does it take to build a gypsum room partition in an apartment?',
        answer: 'A standard partition wall (4x3 meters) with acoustic insulation and primer is installed in just 1 to 2 days.',
      },
      {
        question: 'Does gypsum board block sound between rooms?',
        answer: 'Yes, when installed with double board layers and high-density 50kg/m³ rockwool insulation, it provides superior acoustic isolation (up to 48dB).',
      },
    ],
  },
  {
    id: 'roof-insulation',
    slug: 'roof-leak-insulation',
    title: 'Roof Leak Repair & Waterproof Insulation',
    shortName: 'Roof Leak & Insulation',
    category: 'insulation',
    categoryLabelEn: 'Roof Waterproofing & Thermal Protection',
    tagline: 'Permanent leak prevention, liquid rubber coating, and torch-applied bitumen membrane systems with 10-year warranty',
    description: 'Comprehensive roof waterproofing and thermal insulation to stop rain leaks, ceiling water dripping, and concrete corrosion. We deploy SBS torch-on bitumen membranes, white elastomeric solar-reflective liquid coatings (Gitaroof), and polyurethane injection for leaking basement concrete joints.',
    whyInKuwait: 'Winter in Kuwait brings sudden torrential thunderstorms that penetrate cracked concrete parapets and expansion joints. In summer, the same roof absorbs intense thermal expansion, ripping cheap waterproofing apart. Our systems flex with Kuwait thermal extremes.',
    popularBrands: ['Awazel Kuwait', 'Sika SikaFill', 'Tremco Vulkem', 'Gitaroof Original'],
    price: {
      unit: 'per square meter (m²) installed',
      fromKWD: 1.5,
      toKWD: 4.5,
      averageKWD: 2.8,
      pricingModel: 'sqm',
      includesMaterials: true,
      notesEn: 'Includes ponding water flood testing and a 10-year official written leakage guarantee.',
    },
    features: [
      'UV-reflective brilliant white roof coats reducing top-floor AC load by 20%',
      '100% monolithic seamless membrane with zero risk of joint failures',
      'Certified ponding test (48 hours water flooding) before handover',
      'Emergency 24-hour leak detection and repair service across all Kuwait areas',
    ],
    executionTime: '2 to 4 days for standard residential villa roof (400 m²)',
    executionSteps: [
      'Clearing roof gravel, dust, and peeling old layers down to bare screed',
      'Repairing slope angles toward rainwater drains to eliminate standing ponds',
      'Applying bituminous or polyurethane penetrating primer',
      'Installing polyester reinforcement fabric saturated with elastomeric membrane',
      'Flooding roof for 48 hours to certify complete watertight integrity',
    ],
    expertAdvice: [
      'Inspect and clean your roof drains every October before Kuwait seasonal rains begin.',
      'Check around satellite dish bolts and AC outdoor units, as unsealed screw penetrations cause 60% of ceiling leaks.',
    ],
    recommendedAreas: ['Villa Flat Roofs', 'Chalet Corrugated Metal Roofs', 'Balconies & Open Terraces', 'Basement Retaining Slabs'],
    faqs: [
      {
        question: 'How fast can you repair an active ceiling water leak during rain?',
        answer: 'We dispatch rapid response teams with hydrophobic emergency sealants that can bond and stop active water leaks even on wet surfaces.',
      },
      {
        question: 'What is the best roof insulation for Kuwait weather?',
        answer: 'A combination of torch-applied 4mm SBS bitumen membrane covered by extruded polystyrene thermal foam boards and white solar-reflective coating.',
      },
    ],
  },
  {
    id: 'antique-velvet',
    slug: 'antique-velvet-paints',
    title: 'Velvet, Chamois & Antique Metallic Paints',
    shortName: 'Velvet & Chamois Paints',
    category: 'decorative',
    categoryLabelEn: 'Velvet & Suede Decorative Paints',
    tagline: 'Silky tactile textures, pearlescent suede reflections, and antique patina for luxury dining and master bedrooms',
    description: 'Add depth, warmth, and opulence to interior living spaces with specialized velvet (Khayali), chamois (Shamwa), and antique metallic glazes. These designer paints reflect ambient light with a soft-focus suede effect, transforming master bedrooms, majlis rooms, and dining spaces into intimate, luxurious retreats.',
    whyInKuwait: 'Velvet and chamois decorative paints provide the warm, cozy feel of textile wallpaper with the washability and durability of paint, making them a staple in Kuwaiti reception halls and bridal suites.',
    popularBrands: ['Jotun Lady Design (Romance & Velvet)', 'Caparol Capadecor', 'San Marco Cadoro', 'National Velveteen'],
    price: {
      unit: 'per square meter (m²) or per room accent wall',
      fromKWD: 3.5,
      toKWD: 7.5,
      averageKWD: 5,
      pricingModel: 'sqm',
      includesMaterials: true,
      notesEn: 'Standard bedroom feature wall (15 m²) costs approximately 50 to 75 KWD including primer, velvet material, and artisan application.',
    },
    features: [
      'Silky tactile texture with shimmering multidirectional light reflection',
      'Conceals subtle wall surface unevenness better than standard flat paints',
      'Washable with damp cloth and gentle mild soap',
      'Rich metallic pigments in champagne, warm bronze, pearl grey, and royal gold',
    ],
    executionTime: '1 to 2 days for complete room application',
    executionSteps: [
      'Skim coating and ultra-fine mechanical sanding to achieve mirror smoothness',
      'Applying color-matched tinted acrylic primer base',
      'Applying first coat of velvet paint with short-nap roller',
      'Second artisan coat applied with plastic spatulas in sweeping criss-cross movements',
      'Inspecting under room warm lighting for even suede optical effects',
    ],
    expertAdvice: [
      'Pair velvet paints with warm 2700K ambient wall sconces to bring out the subtle metallic pearlescent reflections.',
    ],
    recommendedAreas: ['Master Bedroom Accent Walls', 'Dining Rooms', 'Private Lounges & Majlis', 'Bridal Suites'],
    faqs: [
      {
        question: 'Can velvet or chamois paint be touched up if scratched?',
        answer: 'Yes, minor scuffs can be gently blended with a small artist sponge using the original paint batch without showing visible patches.',
      },
      {
        question: 'Is velvet paint suitable for homes with young children?',
        answer: 'We recommend velvet paints on accent walls above wainscoting or in adult master bedrooms; for high-traffic kids playrooms, washable eggshell Fenomastic is preferred.',
      },
    ],
  },
];

export function getServiceBySlugEn(slug: string): KuwaitServiceEn | undefined {
  return KUWAIT_SERVICES_DATA_EN.find((s) => s.slug === slug);
}

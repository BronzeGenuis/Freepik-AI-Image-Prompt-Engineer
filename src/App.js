import { useState, useRef } from "react";

// ── DATA ─────────────────────────────────────────────────────────────────────

const MODEL_GROUPS = [
  {
    group: "Flux",
    models: [
      { name: "Flux 1.0 Fast",         credits: "5/img",          desc: "Fast, good-quality images. Great for quick ideas & social media." },
      { name: "Flux 1.0",              credits: "10/img",         desc: "Versatile, good prompt adherence. General-purpose generation." },
      { name: "Flux 1.0 Realism",      credits: "40/img",         desc: "Ultra-realistic. Best for portraits, fashion, architecture." },
      { name: "Flux 1.1",              credits: "50/img",         desc: "Pure precision. Complex scenes, concept art, prompt-specific compositions." },
      { name: "Flux Kontext [Pro]",    credits: "70/img",         desc: "Style & object consistency. Characters, branded visuals, fast ideation." },
      { name: "Flux Kontext [Max]",    credits: "150/img",        desc: "High-precision editing. Text-heavy visuals, typography, product shots." },
      { name: "Flux.2 Pro (1K)",       credits: "50/img +25/ref", desc: "Structured, stable composition. Supports exact color & multi-reference." },
      { name: "Flux.2 Pro (2K)",       credits: "75/img +25/ref", desc: "Same as above, higher resolution. High-res campaigns." },
      { name: "Flux.2 Flex (1K)",      credits: "80/img +25/ref", desc: "Expressive detail, broader interpretation. Concept art, stylized scenes." },
      { name: "Flux.2 Flex (2K)",      credits: "120/img +25/ref","desc": "Same as above, more cinematic. High-end creative content." },
      { name: "Flux.2 Max (1K)",       credits: "130+/img",       desc: "Highest-quality Flux. Up to 8 refs. Product marketing, e-commerce." },
      { name: "Flux.2 Max (2K)",       credits: "195+/img",       desc: "Sharpest Flux resolution. Professional product & advertising imagery." },
      { name: "Flux Klein",            credits: "10/img",         desc: "Lightweight & fast. Simple scenes, drafts, high-volume generation." },
    ]
  },
  {
    group: "Mystic",
    models: [
      { name: "Mystic 1.0",            credits: "45/img", desc: "High quality, detailed textures. Portraits, poster-like illustrations." },
      { name: "Mystic 2.5",            credits: "50/img", desc: "Most versatile, good prompt adherence. General high-quality use." },
      { name: "Mystic 2.5 Flexible",   credits: "80/img", desc: "Best prompt adherence. Character design, branding, precision projects." },
      { name: "Mystic 2.5 Fluid",      credits: "80/img", desc: "Better quality with faster generation. Visual campaigns, large image sets." },
    ]
  },
  {
    group: "Classic",
    models: [
      { name: "Classic Fast",          credits: "1/img",  desc: "Reliable, fast. Good for quick conceptual visuals." },
      { name: "Classic",               credits: "5/img",  desc: "Solid general-purpose result without style-specific tuning." },
    ]
  },
  {
    group: "Google Imagen",
    models: [
      { name: "Google Imagen 3",       credits: "50/img",  desc: "Ultra high-quality. Architecture, interiors, rich atmospheric scenes." },
      { name: "Google Imagen 4",       credits: "100/img", desc: "Incredible photorealism & prompt adherence. Product mockups, typography." },
      { name: "Google Imagen 4 Fast",  credits: "50/img",  desc: "Streamlined Imagen 4. Quick tests, layout exploration." },
      { name: "Google Imagen 4 Ultra", credits: "150/img", desc: "Highest Imagen 4 fidelity. Advertising, editorial, product visuals." },
      { name: "Google Nano Banana",    credits: "120/img", desc: "Gemini 2.5 Flash. Fashion try-ons, product swaps, multi-image campaigns." },
      { name: "Google Nano Banana Pro",credits: "75+/img", desc: "GEMPIX 2. Branded visuals, expressive characters, style trials." },
    ]
  },
  {
    group: "Ideogram",
    models: [
      { name: "Ideogram 3",                      credits: "60/img", desc: "Best for typography & graphic design. Posters, logos, text-based designs." },
      { name: "Ideogram 3 with Image Reference", credits: "60/img", desc: "Ideogram 3 + image refs for character consistency & styling." },
    ]
  },
  {
    group: "GPT",
    models: [
      { name: "GPT",        credits: "150/img",        desc: "General-purpose. Quick concepts, exploratory designs." },
      { name: "GPT 1 HQ",   credits: "500/img",        desc: "Higher-quality GPT. Marketing, detailed illustrations, professional grade." },
      { name: "GPT 1.5",    credits: "150/img (8 refs)","desc": "Multi-reference blending, fast. Social media, marketing drafts, layouts." },
      { name: "GPT 1.5 High",credits: "500/img (8 refs)","desc": "Detailed rendering & controlled variation. Branding, campaigns, product imagery." },
    ]
  },
  {
    group: "Seedream",
    models: [
      { name: "Seedream 3.0",     credits: "100/img",         desc: "High-res, fast & accurate. Photorealistic portraits, text rendering." },
      { name: "Seedream 4.0",     credits: "50/img",          desc: "4K in under 2s, up to 6 refs. Storyboarding, campaigns, branding." },
      { name: "Seedream 4.5",     credits: "50/img (4 refs)", desc: "Stronger character control, 4K. Ads, e-commerce, film & gaming assets." },
      { name: "Seedream 5.0 Lite",credits: "50/img",          desc: "Up to 14 refs, multi-round editing. Campaigns, brand assets, social sets." },
    ]
  },
  {
    group: "Recraft",
    models: [
      { name: "Recraft V4",     credits: "60/img",  desc: "Structured compositions, typography-friendly. Branding, posters, ads." },
      { name: "Recraft V4 Pro", credits: "175/img", desc: "2K version with enhanced prompt understanding. Premium branding, high-res work." },
    ]
  },
  {
    group: "Reve",
    models: [
      { name: "Reve", credits: "80/img (4 refs)", desc: "Aesthetic-focused with rich detail. Artistic renders, posters, text accuracy." },
    ]
  },
  {
    group: "Qwen",
    models: [
      { name: "Qwen", credits: "30/img", desc: "High-fidelity, strong text rendering. Text-intensive visuals, multilingual posters." },
    ]
  },
  {
    group: "Z-Image",
    models: [
      { name: "Z-Image", credits: "5/img", desc: "Ultra-realistic at impressive speed. Product imagery, editorial scenes." },
    ]
  },
  {
    group: "AI Assistant",
    models: [
      { name: "AI Assistant — GPT4o",      credits: "150/img", desc: "Real-time image gen while chatting. Brainstorming, fast prototyping." },
      { name: "AI Assistant — GPT4o High", credits: "500/img", desc: "Higher-quality chat-based generation. Refined visual experimentation." },
    ]
  },
  {
    group: "Runway",
    models: [
      { name: "Runway Gen-4 References", credits: "200/img", desc: "Up to 3 visual refs. Visual stories with recurring characters & settings." },
    ]
  },
];

const STYLES = [
  "Photorealistic","Cinematic photography","Documentary / Editorial photography","Fashion photography",
  "Portrait photography","Macro photography","Aerial photography","Street photography",
  "Fine art photography","Film noir photography","Lomography / Lo-fi film","Infrared photography",
  "Long exposure photography","Tilt-shift photography","Digital painting","Concept art",
  "Matte painting","3D render / CGI","Octane render","Unreal Engine render","Isometric illustration",
  "Flat design illustration","Vector illustration","Low poly art","Pixel art","Glitch art","Fractal art",
  "Generative / Abstract digital","Oil painting","Watercolor painting","Gouache painting","Acrylic painting",
  "Ink drawing / Pen and ink","Charcoal sketch","Pencil sketch","Pastel drawing","Linocut / Woodblock print",
  "Etching / Engraving","Children's book illustration","Comic book / Graphic novel","Manga / Anime",
  "Webtoon style","Cartoon / Animated","Storybook / Fairy tale","Editorial illustration",
  "Scientific / Technical illustration","Retro poster illustration","Propaganda poster style",
  "Infographic / Diagrammatic","Art Nouveau","Art Deco","Bauhaus","Surrealism","Cubism","Impressionism",
  "Expressionism","Pop Art","Minimalism","Maximalism","Brutalism","Cyberpunk","Steampunk","Solarpunk",
  "Vaporwave / Synthwave","Retrowave / 80s aesthetic","Y2K aesthetic","Dark academia","Noir / Neo-noir",
  "Studio Ghibli-inspired","Fantasy / High fantasy","Dark fantasy","Sci-fi / Space opera",
  "Post-apocalyptic","Dreamcore / Weirdcore"
];

const MOODS = [
  "Elegant & Sophisticated","Rugged & Raw","Whimsical & Playful","Stark & Minimalist",
  "Mysterious & Enigmatic","Energetic & Dynamic","Serene & Peaceful","Melancholic & Nostalgic",
  "Dark & Foreboding","Romantic & Dreamy","Epic & Grandiose","Tense & Dramatic","Eerie & Unsettling",
  "Hopeful & Uplifting","Gritty & Intense","Ethereal & Otherworldly","Cozy & Warm","Cold & Isolated",
  "Majestic & Awe-inspiring","Surreal & Disorienting","Nostalgic & Vintage","Futuristic & Sleek",
  "Raw & Emotional","Joyful & Vibrant","Other"
];

const ANGLES = [
  "Eye-level (neutral, natural)","Bird's eye view (directly above)","Aerial / High angle (looking down)",
  "Worm's eye view (looking up from below)","Dutch angle / Canted angle (tilted for tension)",
  "Over-the-shoulder (POV/behind subject)","First-person POV","Three-quarter angle","Profile / Side view",
  "Front-facing / Direct","Rear view / Back-facing","Low angle (slightly below eye level)",
  "High angle (slightly above eye level)","Extreme close-up (detail focus)","Close-up (face/object)",
  "Medium close-up (head and shoulders)","Medium shot (waist up)","Medium full shot (knees up)",
  "Full body shot","Wide shot (subject in environment)","Extreme wide shot (environment dominant)",
  "Establishing shot (location context)","Two-shot (two subjects)","Overhead flat lay",
  "Satellite / Top-down map view"
];

const COMPOSITIONS = [
  "Rule of thirds","Golden ratio / Fibonacci spiral","Centered / Symmetrical","Asymmetric balance",
  "Leading lines (paths, roads, corridors)","Framing within a frame (doorways, windows)",
  "Negative space (left)","Negative space (right)","Negative space (top)","Negative space (bottom)",
  "Dynamic diagonal movement","Radial composition (elements from center)","Triangular composition",
  "Layered depth (foreground, mid, background)","Minimalist (subject only, bare background)",
  "Crowded / Maximalist (rich detail throughout)","Pattern / Repetition","Juxtaposition (contrasting elements)",
  "S-curve composition","Z-pattern composition","Figure-ground contrast",
  "Vanishing point / One-point perspective","Two-point perspective","Silhouette against background"
];

const LIGHTING = [
  "Golden hour (warm sunrise/sunset)","Blue hour (cool twilight)","Midday harsh sunlight",
  "Overcast / Diffused natural light","Dappled light (through trees/leaves)","Moonlight / Nighttime natural",
  "Storm light (dramatic pre-storm)","Fog / Mist light (soft and diffused)","Desert sunlight (intense, high contrast)",
  "Snow light (cool, reflective)","Soft box / Studio soft light","Hard studio light (dramatic shadows)",
  "Ring light (even, catchlight in eyes)","Three-point studio lighting","High-key lighting (bright, minimal shadows)",
  "Low-key lighting (dark, deep shadows)","Rembrandt lighting (triangle shadow on cheek)",
  "Butterfly lighting (shadow under nose)","Split lighting (half face lit)","Rim / Edge lighting (backlit outline glow)",
  "Silhouette lighting (subject dark, bright bg)","Neon glow (colored neon signs)","Bioluminescent glow",
  "Candlelight / Firelight (warm, flickering)","Fireplace light","Lantern light","Underwater caustic light",
  "God rays / Volumetric light beams","Laser / Beam lighting","Strobe / Flash lighting",
  "RGB / Colored gels lighting","Blacklight / UV glow","Lava glow / Ember light","Aurora borealis light",
  "Stained glass light (colored, patterned)","Cyberpunk neon city light","Fluorescent office light (cold, flat)",
  "Edison bulb / Warm tungsten","Spotlight (single focused beam)","Cross lighting (from two sides)"
];

const TECHNIQUES = [
  "Shallow depth of field (blurred background)","Deep depth of field (everything sharp)",
  "Bokeh (aesthetic background blur circles)","Long exposure (motion blur / light trails)",
  "High dynamic range (HDR)","Macro (extreme close-up detail)","Lens flare","Chromatic aberration",
  "Vignette (darkened edges)","Film grain / Noise","Double exposure","Motion blur",
  "Freeze motion / High shutter speed","Infrared effect","Tilt-shift effect (miniature look)",
  "Anamorphic lens look","Fisheye lens distortion","Telephoto compression","Wide angle distortion",
  "Soft focus / Dreamy blur","Sharp hyperdetail","Cross-processing film effect","Cyanotype effect",
  "Daguerreotype effect (vintage)","None / Clean standard render"
];

const COLOR_PALETTES = [
  "Warm earth tones (terracotta, ochre, sienna)","Desert sunset (orange, red, gold)",
  "Autumn palette (burnt orange, deep red, brown)","Warm neutrals (cream, beige, sand, taupe)",
  "Golden palette (gold, amber, honey)","Fire palette (red, orange, yellow)","Rust and copper tones",
  "Cool blues and greys","Arctic / Ice palette (white, pale blue, silver)","Ocean palette (deep navy, teal, aqua)",
  "Midnight palette (dark navy, charcoal, black)","Steel and slate (industrial cool greys)",
  "Cool mint and sage","Stormy palette (grey, dark blue, muted green)","Monochromatic (single hue, varying shades)",
  "Black and white / Grayscale","Sepia / Vintage brown tones","Muted / Desaturated tones",
  "Dusty vintage palette","Greige (grey-beige neutral)","Dark and moody (deep, rich, low saturation)",
  "Vibrant / Highly saturated","Neon and electric colors","Primary colors (bold red, blue, yellow)",
  "Pop art palette (bold, flat, graphic)","Tropical (bright green, yellow, pink, cyan)",
  "Festival colors (multicolor, celebratory)","Rainbow gradient",
  "Soft pastels (baby pink, lavender, mint)","Cottagecore pastels (dusty rose, sage, cream)",
  "Spring palette (fresh, light, floral)","Baby / Nursery palette (soft, gentle)","Dreamy pastels (faded, washed out)",
  "Cyberpunk palette (neon pink, electric blue, purple)","Vaporwave (pink, purple, teal retrowave)",
  "Synthwave (purple, magenta, dark blue)","Forest palette (deep greens, brown, moss)",
  "Enchanted / Magical (purple, gold, deep blue)","Gothic palette (black, crimson, deep purple)",
  "Sci-fi palette (electric blue, silver, white)","Royal palette (deep purple, gold, navy)",
  "Horror palette (blood red, dark grey, black)","Vintage film palette (faded greens, yellows)",
  "Noir palette (black, white, deep shadow)","Warm film look (orange and teal grade)",
  "Complementary contrast (opposite hues)","Analogous harmony (neighboring hues)","Triadic harmony (three evenly spaced hues)"
];

const ENVIRONMENTS = [
  "Indoors — Minimalist modern living room","Indoors — Cozy rustic interior","Indoors — Grand cathedral interior",
  "Indoors — Corporate office / Boardroom","Indoors — Laboratory / Science facility","Indoors — Cozy coffee shop / Café",
  "Indoors — Neon-lit bar / Nightclub","Indoors — Classic library with tall shelves","Indoors — Space station interior",
  "Indoors — Underground bunker","Outdoors — Open grassy meadow","Outdoors — Misty pine forest",
  "Outdoors — Sandy tropical beach","Outdoors — Snow-capped mountain range","Outdoors — Desert sand dunes",
  "Outdoors — Volcanic landscape / Lava fields","Outdoors — Tropical jungle / Rainforest","Outdoors — Cherry blossom grove",
  "Outdoors — Autumn forest (golden leaves)","Outdoors — Waterfall (tall and dramatic)","Outdoors — Calm lake with reflections",
  "Outdoors — Starry night sky / Milky way","Outdoors — Aurora borealis","Outdoors — Rolling green hills",
  "Urban — Busy city street (daytime)","Urban — Rainy city street at night","Urban — Neon-lit cyberpunk city",
  "Urban — Rooftop with city skyline","Urban — Cobblestone European alley","Urban — Ancient ruins (Greek/Roman)",
  "Urban — Medieval castle exterior","Urban — Japanese temple / Shrine","Urban — Post-apocalyptic ruined city",
  "Urban — Overgrown abandoned city","Urban — Futuristic megacity skyline","Abstract — Pure gradient background",
  "Abstract — Bokeh light orbs","Abstract — Galaxy / Nebula background","Abstract — Dark void / Pure black",
  "Abstract — Geometric pattern background","Abstract — Smoke and fog wisps","Abstract — Neon grid / Tron-style",
  "Studio — Isolated / No background"
];

const TIMES = [
  "Early morning (soft, misty, cool light)","Morning (fresh, warm, rising sun)","Midday (harsh, bright, high sun)",
  "Afternoon (warm, long shadows)","Golden hour (warm, glowing, magical)","Sunset (dramatic, colorful horizon)",
  "Blue hour (cool, twilight calm)","Dusk (fading light, purple sky)","Night (dark, moody, artificial light)",
  "Deep night / Midnight (very dark, minimal light)","Overcast / Cloudy (flat, diffused)",
  "Stormy / Rain (dramatic, wet)","Foggy / Misty (soft, eerie)","Snowy (cold, silent, white)","Timeless / Not applicable"
];

const SEASONS = ["Spring","Summer","Autumn","Winter","Not applicable"];
const BG_DETAIL = ["Blurred / Out of focus","Slightly detailed","Fully detailed","Hyperdetailed"];
const IMG_PURPOSES = ["Style","Color Palette","Character Posture","Lighting","Background","Character","Element","Color","Effects","Camera","All of it"];

// ── HELPERS ───────────────────────────────────────────────────────────────────

function ModelPicker({ value, onChange }) {
  const selected = MODEL_GROUPS.flatMap(g => g.models).find(m => m.name === value);
  return (
    <div style={styles.fieldWrap}>
      <label style={styles.label}>Freepik AI Model</label>
      <div style={styles.selectWrap}>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ ...styles.select, color: value ? "#f0e6d3" : "#8a7a6a" }}
        >
          <option value="">— select model —</option>
          {MODEL_GROUPS.map(g => (
            <optgroup key={g.group} label={`── ${g.group} ──`} style={{ color: "#c49a3c", background: "#1a1510" }}>
              {g.models.map(m => (
                <option key={m.name} value={m.name}>{m.name} · {m.credits}</option>
              ))}
            </optgroup>
          ))}
        </select>
        <span style={styles.chevron}>▾</span>
      </div>
      {selected && (
        <div style={styles.modelInfo}>
          <span style={styles.modelCredits}>{selected.credits}</span>
          <span style={styles.modelDesc}>{selected.desc}</span>
        </div>
      )}
    </div>
  );
}

const CUSTOM_SENTINEL = "__custom__";

function Select({ label, options, value, onChange, placeholder = "— select —" }) {
  const isCustom = value !== "" && !options.includes(value);

  function handleSelectChange(e) {
    if (e.target.value === CUSTOM_SENTINEL) {
      onChange(CUSTOM_SENTINEL);
    } else {
      onChange(e.target.value);
    }
  }

  const showCustomInput = isCustom || value === CUSTOM_SENTINEL;
  const displayVal = showCustomInput ? CUSTOM_SENTINEL : value;

  return (
    <div style={styles.fieldWrap}>
      <label style={styles.label}>{label}</label>
      <div style={styles.selectWrap}>
        <select
          value={displayVal}
          onChange={handleSelectChange}
          style={{ ...styles.select, color: displayVal ? "#f0e6d3" : "#8a7a6a" }}
        >
          <option value="">{placeholder}</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
          <option value={CUSTOM_SENTINEL}>✏️  Type custom...</option>
        </select>
        <span style={styles.chevron}>▾</span>
      </div>
      {showCustomInput && (
        <div style={styles.customInputWrap}>
          <span style={styles.customInputIcon}>✏️</span>
          <input
            autoFocus
            value={value === CUSTOM_SENTINEL ? "" : value}
            onChange={e => onChange(e.target.value || CUSTOM_SENTINEL)}
            placeholder={`Enter custom ${label.toLowerCase()}...`}
            style={styles.customInput}
          />
          <button
            onClick={() => onChange("")}
            style={styles.customClearBtn}
            title="Back to list"
          >✕</button>
        </div>
      )}
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder, multiline }) {
  return (
    <div style={styles.fieldWrap}>
      <label style={styles.label}>{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          style={styles.textarea}
        />
      ) : (
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={styles.input}
        />
      )}
    </div>
  );
}

function SectionTitle({ num, title }) {
  return (
    <div style={styles.sectionTitle}>
      <span style={styles.sectionNum}>{num}</span>
      <span>{title}</span>
    </div>
  );
}

// ── CHATGPT SYSTEM PROMPT ────────────────────────────────────────────────────

const CHATGPT_SYSTEM_PROMPT = `You are an expert AI image prompt engineer.
Your sole job is to receive structured image concept inputs and convert them 
into a single flowing, detailed, ready-to-use AI image generation prompt.

===============================================================================
PRIME DIRECTIVES
===============================================================================

1. SINGLE JOB:
When you receive a structured input, you write ONE flowing prose image prompt.
You do NOT reformat the input. You do NOT echo back the fields.
You do NOT make a list. You write a single cohesive paragraph-style prompt
exactly like a professional would type into Midjourney, Freepik, or DALL·E.

2. NO PREAMBLE — CRITICAL:
Output nothing before the code block. No "Here is your prompt." No "Sure!"
No explanation. No commentary. Just the code block, then the character count.
That is all. Every single time.

3. INPUT FORMAT:
You will receive inputs structured like this:

Concept: [overall idea]
Subject: [full subject description]
Visual Style: [style + mood]
Composition: [angle + layout]
Lighting: [light type + technique]
Color Palette: [chosen palette]
Environment: [setting + detail + time of day]
Quality: [quality tags]
Avoid: [optional]
[preserve exactly: ...]

Extract every field. Never ask questions. Never wait for confirmation.
Output the final prompt immediately.

4. SUBJECT FIDELITY — CRITICAL:
Every subject detail must appear VERBATIM in the output.
Copy clothing, colors, accessories, face, beard, and hair EXACTLY as written.
"White thobe" stays "white thobe". "Kufi" stays "kufi". Never paraphrase. Never swap.
The [preserve exactly: ...] block is your checklist — every item in it MUST 
appear word-for-word somewhere in the generated prompt.

5. CHARACTER FORMULA:
Always describe human subjects using this structure:

A [age]-year-old [ethnicity] [religion] [gender], wearing [clothing + accessories], 
with [facial features] and [hair/beard].

6. QUALITY TAGS:
Use the Quality field exactly as given. Do not add to or remove from it.

7. AVOID:
If an Avoid field is present, append: avoid: [content] at the end of the prompt.

8. PRESERVE BLOCK:
Always copy the [preserve exactly: ...] line verbatim as the final line of the prompt.

===============================================================================
OUTPUT FORMAT — EXACTLY THIS, NOTHING ELSE
===============================================================================

[Your full flowing prose image prompt here. One or two paragraphs. 
No field labels. No bullet points. No headers. Just natural image prompt text.]

[preserve exactly: copied verbatim from input]

Character count: [X] / 10,000

===============================================================================
WHAT THE OUTPUT MUST LOOK LIKE — STUDY THIS CAREFULLY
===============================================================================

For this input:

  Concept: A muslim man sitting on a couch
  Subject: A 35-year-old Indian Muslim Man, wearing White thobe and kufi,
  facial features: neutral, hair/beard: long well groomed beard
  Visual Style: Fashion photography, Whimsical & Playful mood
  Composition: Eye-level (neutral, natural)
  Lighting: Soft box / Studio soft light
  Color Palette: Royal palette (deep purple, gold, navy)
  Environment: Indoors — Cozy coffee shop / Café, Timeless
  Quality: high resolution, sharp focus, highly detailed
  [preserve exactly: White thobe and kufi, neutral, long well groomed beard]

The correct output is:

A 35-year-old Indian Muslim man, wearing a white thobe and white kufi, with neutral 
facial features and a long well-groomed beard, seated comfortably on a couch. Fashion 
photography style with a whimsical and playful mood. Eye-level angle with a natural, 
balanced framing. Soft box studio lighting producing smooth, even illumination with 
gentle shadow gradients. Royal color palette throughout — deep purple, rich gold, and 
navy tones dominate the atmosphere. Cozy coffee shop interior setting, warm ambient 
café details, rich wooden textures, timeless atmosphere. High resolution, sharp focus, 
highly detailed.

[preserve exactly: White thobe and kufi, neutral, long well groomed beard]

Character count: 723 / 10,000

This example is for your reference ONLY. Do not output it. Do not reference it.
Use it only to understand the correct output format and style.

===============================================================================
HARD LIMIT: 10,000 characters. Trim filler only. Never cut subject details.
BEGIN: Wait for structured input. Output the prompt immediately when received.
===============================================================================`;

// ── MAIN ──────────────────────────────────────────────────────────────────────

export default function PromptBuilder() {
  // Subject
  const [mainIdea, setMainIdea] = useState("");
  const [age, setAge] = useState("");
  const [race, setRace] = useState("");
  const [religion, setReligion] = useState("");
  const [gender, setGender] = useState("");
  const [clothing1, setClothing1] = useState("");
  const [clothing2, setClothing2] = useState("");
  const [accessories, setAccessories] = useState("");
  const [facial, setFacial] = useState("");
  const [hair, setHair] = useState("");
  const [model, setModel] = useState("");

  // Reference images
  const [refImages, setRefImages] = useState([]);
  const fileRef = useRef();

  // Style
  const [style, setStyle] = useState("");
  const [mood, setMood] = useState("");

  // Composition
  const [angle, setAngle] = useState("");
  const [composition, setComposition] = useState("");

  // Lighting
  const [lighting, setLighting] = useState("");
  const [technique, setTechnique] = useState("");

  // Color
  const [colorPalette, setColorPalette] = useState("");

  // Environment
  const [environment, setEnvironment] = useState("");
  const [bgDetail, setBgDetail] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [season, setSeason] = useState("");

  // Avoid
  const [avoid, setAvoid] = useState("");

  // Output
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedSystem, setCopiedSystem] = useState(false);

  // ── IMAGE UPLOAD ────────────────────────────────────────────────────────────

  function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        setRefImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          name: file.name,
          url: ev.target.result,
          description: "",
          purposes: []
        }]);
      };
      reader.readAsDataURL(file);
    });
  }

  function updateRefImage(id, key, val) {
    setRefImages(prev => prev.map(img => img.id === id ? { ...img, [key]: val } : img));
  }

  function togglePurpose(id, purpose) {
    setRefImages(prev => prev.map(img => {
      if (img.id !== id) return img;
      const has = img.purposes.includes(purpose);
      return { ...img, purposes: has ? img.purposes.filter(p => p !== purpose) : [...img.purposes, purpose] };
    }));
  }

  function removeImage(id) {
    setRefImages(prev => prev.filter(img => img.id !== id));
  }

  // ── HELPERS ────────────────────────────────────────────────────────────────
  function clean(val) {
    return val === CUSTOM_SENTINEL ? "" : (val || "");
  }

  // ── GENERATE ────────────────────────────────────────────────────────────────

  function buildSubject() {
    const parts = [];
    if (age || race || religion || gender) {
      let line = "";
      if (age) line += `A ${age}-year-old `;
      if (race) line += `${race} `;
      if (religion) line += `${religion} `;
      if (gender) line += `${gender}`;
      parts.push(line.trim());
    }
    const wearing = [clothing1, clothing2].filter(Boolean);
    if (wearing.length) parts.push(`wearing ${wearing.join(" and ")}`);
    if (accessories) parts.push(`with accessories: ${accessories}`);
    if (facial) parts.push(`facial features: ${facial}`);
    if (hair) parts.push(`hair/beard: ${hair}`);
    return parts.join(", ");
  }

  function generate() {
    let out = "";

    // Reference images
    if (refImages.length > 0) {
      refImages.forEach((img, i) => {
        const tag = `@img${i + 1}`;
        if (img.purposes.length > 0) {
          img.purposes.forEach(p => {
            out += `${p}: Use the ${p.toLowerCase()} of ${tag}.\n`;
          });
        } else if (img.description) {
          out += `Reference ${tag}: ${img.description}\n`;
        }
      });
      out += "\n";
    }

    if (mainIdea) out += `Concept: ${mainIdea}\n\n`;

    const subject = buildSubject();
    if (subject) out += `Subject: ${subject}\n\n`;

    if (clean(style) || clean(mood)) {
      out += `Visual Style: `;
      if (clean(style)) out += clean(style);
      if (clean(style) && clean(mood)) out += `, `;
      if (clean(mood)) out += `${clean(mood)} mood`;
      out += `\n\n`;
    }

    if (clean(angle) || clean(composition)) {
      out += `Composition: `;
      if (clean(angle)) out += clean(angle);
      if (clean(angle) && clean(composition)) out += `, `;
      if (clean(composition)) out += clean(composition);
      out += `\n\n`;
    }

    if (clean(lighting) || clean(technique)) {
      out += `Lighting: `;
      if (clean(lighting)) out += clean(lighting);
      if (clean(lighting) && clean(technique)) out += `, `;
      if (clean(technique)) out += clean(technique);
      out += `\n\n`;
    }

    if (clean(colorPalette)) out += `Color Palette: ${clean(colorPalette)}\n\n`;

    if (clean(environment) || clean(bgDetail) || clean(timeOfDay) || clean(season)) {
      out += `Environment: `;
      const envParts = [clean(environment), clean(bgDetail) && `background ${clean(bgDetail)}`, clean(timeOfDay), clean(season) && clean(season) !== "Not applicable" ? `${clean(season)} season` : ""].filter(Boolean);
      out += envParts.join(", ");
      out += `\n\n`;
    }

    // Quality tags
    const qualityMap = {
      "Photorealistic": "high resolution, sharp focus, photographic quality",
      "Cinematic photography": "cinematic grade, rich color, film grain",
      "3D render / CGI": "Octane render quality, ultra-detailed, clean lighting",
      "Octane render": "Octane render quality, photorealistic materials, studio lighting",
      "Watercolor painting": "painterly texture, soft finish, high resolution",
      "Digital painting": "clean linework, vibrant render, print quality",
      "Concept art": "detailed concept art, professional illustration, sharp detail",
    };
    const quality = qualityMap[clean(style)] || "high resolution, sharp focus, highly detailed";
    out += `Quality: ${quality}\n\n`;

    if (clean(model)) out += `Model: ${clean(model)}\n\n`;

    if (avoid && avoid.toLowerCase() !== "none") out += `no: ${avoid}\n\n`;

    // Locked details
    const locked = [clothing1, clothing2, accessories, facial, hair].filter(Boolean);
    if (locked.length) {
      out += `[preserve exactly: ${locked.join(", ")}]`;
    }

    setGeneratedPrompt(out.trim());
  }

  function copyPrompt() {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function copySystemPrompt() {
    navigator.clipboard.writeText(CHATGPT_SYSTEM_PROMPT);
    setCopiedSystem(true);
    setTimeout(() => setCopiedSystem(false), 2000);
  }

  function reset() {
    setMainIdea(""); setAge(""); setRace(""); setReligion(""); setGender("");
    setClothing1(""); setClothing2(""); setAccessories(""); setFacial(""); setHair("");
    setModel(""); setRefImages([]); setStyle(""); setMood(""); setAngle("");
    setComposition(""); setLighting(""); setTechnique(""); setColorPalette("");
    setEnvironment(""); setBgDetail(""); setTimeOfDay(""); setSeason(""); setAvoid("");
    setGeneratedPrompt("");
  }

  const hasOutput = generatedPrompt.length > 0;

  return (
    <div style={styles.root}>
      {/* BG texture */}
      <div style={styles.bgNoise} />

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div>
            <div style={styles.badge}>AI IMAGE</div>
            <h1 style={styles.title}>Prompt Builder</h1>
            <p style={styles.subtitle}>Craft perfect Freepik / Midjourney prompts visually</p>
          </div>
          <button onClick={reset} style={styles.resetBtn}>↺ Reset</button>
        </div>
      </header>

      <div style={styles.body}>
        {/* LEFT COLUMN */}
        <div style={styles.leftCol}>

          {/* 1 — CONCEPT */}
          <div style={styles.card}>
            <SectionTitle num="01" title="Core Concept" />
            <TextInput
              label="Main idea or concept"
              value={mainIdea}
              onChange={setMainIdea}
              placeholder="e.g. A warrior standing on a cliff at sunset..."
              multiline
            />
            <ModelPicker value={model} onChange={setModel} />
          </div>

          {/* 2 — SUBJECT */}
          <div style={styles.card}>
            <SectionTitle num="02" title="Subject / Character" />
            <p style={styles.hint}>Fill only what applies. Locked details will be preserved verbatim in the prompt.</p>
            <div style={styles.grid2}>
              <TextInput label="Age" value={age} onChange={setAge} placeholder="e.g. 35" />
              <TextInput label="Race / Ethnicity" value={race} onChange={setRace} placeholder="e.g. Indian" />
              <TextInput label="Religion (optional)" value={religion} onChange={setReligion} placeholder="e.g. Muslim" />
              <TextInput label="Gender" value={gender} onChange={setGender} placeholder="e.g. man" />
            </div>
            <TextInput label="Primary clothing" value={clothing1} onChange={setClothing1} placeholder="e.g. white thobe" />
            <TextInput label="Secondary clothing / Footwear" value={clothing2} onChange={setClothing2} placeholder="e.g. black Chelsea boots" />
            <TextInput label="Accessories / Extra details" value={accessories} onChange={setAccessories} placeholder="e.g. gold watch, sunglasses" />
            <TextInput label="Facial features" value={facial} onChange={setFacial} placeholder="e.g. calm expression, sharp jawline" />
            <TextInput label="Hair / Beard" value={hair} onChange={setHair} placeholder="e.g. long well-groomed beard, short dark hair" />
          </div>

          {/* 3 — REFERENCE IMAGES */}
          <div style={styles.card}>
            <SectionTitle num="03" title="Reference Images" />
            <p style={styles.hint}>Upload images and tell what each is used for.</p>
            <div
              style={styles.uploadZone}
              onClick={() => fileRef.current.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); handleImageUpload({ target: { files: e.dataTransfer.files } }); }}
            >
              <span style={styles.uploadIcon}>⊕</span>
              <span style={styles.uploadText}>Click or drag images here</span>
              <input ref={fileRef} type="file" multiple accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
            </div>

            {refImages.map((img, i) => (
              <div key={img.id} style={styles.refImageCard}>
                <div style={styles.refImageTop}>
                  <img src={img.url} alt="" style={styles.refThumb} />
                  <div style={{ flex: 1 }}>
                    <div style={styles.refLabel}>@img{i + 1} — {img.name}</div>
                    <input
                      value={img.description}
                      onChange={e => updateRefImage(img.id, "description", e.target.value)}
                      placeholder="Describe what's in this image..."
                      style={styles.refDesc}
                    />
                  </div>
                  <button onClick={() => removeImage(img.id)} style={styles.removeBtn}>✕</button>
                </div>
                <div style={styles.refPurposeRow}>
                  <span style={styles.hint}>Use for: </span>
                  {IMG_PURPOSES.map(p => (
                    <button
                      key={p}
                      onClick={() => togglePurpose(img.id, p)}
                      style={{ ...styles.purposeBtn, ...(img.purposes.includes(p) ? styles.purposeBtnActive : {}) }}
                    >{p}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div style={styles.rightCol}>

          {/* 4 — STYLE & MOOD */}
          <div style={styles.card}>
            <SectionTitle num="04" title="Visual Style & Mood" />
            <div style={styles.grid2}>
              <Select label="Artistic style" options={STYLES} value={style} onChange={setStyle} />
              <Select label="Mood / Emotion" options={MOODS} value={mood} onChange={setMood} />
            </div>
          </div>

          {/* 5 — COMPOSITION */}
          <div style={styles.card}>
            <SectionTitle num="05" title="Composition & Camera" />
            <div style={styles.grid2}>
              <Select label="Camera angle" options={ANGLES} value={angle} onChange={setAngle} />
              <Select label="Compositional layout" options={COMPOSITIONS} value={composition} onChange={setComposition} />
            </div>
          </div>

          {/* 6 — LIGHTING */}
          <div style={styles.card}>
            <SectionTitle num="06" title="Lighting" />
            <div style={styles.grid2}>
              <Select label="Lighting type" options={LIGHTING} value={lighting} onChange={setLighting} />
              <Select label="Photography technique" options={TECHNIQUES} value={technique} onChange={setTechnique} />
            </div>
          </div>

          {/* 7 — COLOR */}
          <div style={styles.card}>
            <SectionTitle num="07" title="Color Palette" />
            <Select label="Color scheme" options={COLOR_PALETTES} value={colorPalette} onChange={setColorPalette} />
          </div>

          {/* 8 — ENVIRONMENT */}
          <div style={styles.card}>
            <SectionTitle num="08" title="Environment & Background" />
            <Select label="Environment / Setting" options={ENVIRONMENTS} value={environment} onChange={setEnvironment} />
            <div style={styles.grid2}>
              <Select label="Background detail" options={BG_DETAIL} value={bgDetail} onChange={setBgDetail} />
              <Select label="Time of day" options={TIMES} value={timeOfDay} onChange={setTimeOfDay} />
            </div>
            <Select label="Season" options={SEASONS} value={season} onChange={setSeason} />
          </div>

          {/* 9 — AVOID */}
          <div style={styles.card}>
            <SectionTitle num="09" title="Avoid" />
            <TextInput
              label="Things to avoid (elements, colors, styles, objects, text...)"
              value={avoid}
              onChange={setAvoid}
              placeholder="e.g. text, watermarks, extra limbs, blur... or leave blank"
              multiline
            />
          </div>

          {/* GENERATE */}
          <button onClick={generate} style={styles.generateBtn}>
            <span style={styles.generateIcon}>✦</span> Generate Prompt
          </button>

        </div>
      </div>

      {/* OUTPUT */}
      {hasOutput && (
        <div style={styles.outputSection}>

          {/* Workflow Guide */}
          <div style={styles.workflowBox}>
            <div style={styles.workflowTitle}>⚡ How to use this in ChatGPT</div>
            <div style={styles.workflowSteps}>
              <div style={styles.workflowStep}>
                <span style={styles.workflowNum}>1</span>
                <span style={styles.workflowText}>Click <strong style={{color:"#c49a3c"}}>Copy System Prompt</strong> → open a <strong style={{color:"#c49a3c"}}>new ChatGPT chat</strong> → paste it as your first message.</span>
              </div>
              <div style={styles.workflowStep}>
                <span style={styles.workflowNum}>2</span>
                <span style={styles.workflowText}>Click <strong style={{color:"#c49a3c"}}>Copy Prompt</strong> → paste it as your second message. ChatGPT will return your final image prompt.</span>
              </div>
              <div style={styles.workflowStep}>
                <span style={styles.workflowNum}>3</span>
                <span style={styles.workflowText}>For new images, keep the same chat open and just paste a new generated prompt — no need to re-send the system prompt.</span>
              </div>
            </div>
          </div>

          <div style={styles.outputHeader}>
            <div>
              <div style={styles.outputTitle}>Generated Prompt</div>
              <div style={styles.outputMeta}>{generatedPrompt.length} / 10,000 characters</div>
            </div>
            <div style={styles.outputActions}>
              <button onClick={copySystemPrompt} style={copiedSystem ? styles.copiedBtn : styles.systemBtn}>
                {copiedSystem ? "✓ System Prompt Copied!" : "① Copy System Prompt"}
              </button>
              <button onClick={copyPrompt} style={copied ? styles.copiedBtn : styles.copyBtn}>
                {copied ? "✓ Copied!" : "② Copy Prompt"}
              </button>
              <a
                href="https://chatgpt.com"
                target="_blank"
                rel="noreferrer"
                style={styles.chatgptBtn}
              >
                Open ChatGPT ↗
              </a>
            </div>
          </div>
          <pre style={styles.outputPre}>{generatedPrompt}</pre>
        </div>
      )}
    </div>
  );
}

// ── STYLES ────────────────────────────────────────────────────────────────────

const styles = {
  root: {
    minHeight: "100vh",
    background: "#0e0c0a",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    color: "#f0e6d3",
    position: "relative",
    overflowX: "hidden",
  },
  bgNoise: {
    position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
    backgroundImage: `radial-gradient(ellipse 80% 60% at 20% 10%, rgba(180,130,60,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 80%, rgba(100,70,30,0.05) 0%, transparent 60%)`,
  },
  header: {
    borderBottom: "1px solid rgba(180,130,60,0.2)",
    background: "rgba(14,12,10,0.95)",
    position: "sticky", top: 0, zIndex: 100,
    backdropFilter: "blur(10px)",
  },
  headerInner: {
    maxWidth: 1300, margin: "0 auto", padding: "16px 24px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  badge: {
    display: "inline-block",
    fontSize: 10, fontFamily: "'Courier New', monospace",
    letterSpacing: "0.2em", color: "#c49a3c",
    background: "rgba(196,154,60,0.1)", border: "1px solid rgba(196,154,60,0.3)",
    padding: "2px 8px", borderRadius: 2, marginBottom: 4,
  },
  title: {
    margin: 0, fontSize: 28, fontWeight: "normal",
    letterSpacing: "-0.02em", color: "#f5e8d0",
    lineHeight: 1,
  },
  subtitle: {
    margin: "4px 0 0", fontSize: 12, color: "#8a7a6a",
    fontFamily: "'Courier New', monospace", letterSpacing: "0.05em",
  },
  resetBtn: {
    background: "transparent", border: "1px solid rgba(180,130,60,0.3)",
    color: "#c49a3c", padding: "8px 18px", borderRadius: 4,
    cursor: "pointer", fontFamily: "'Courier New', monospace",
    fontSize: 12, letterSpacing: "0.05em",
    transition: "all 0.2s",
  },
  body: {
    maxWidth: 1300, margin: "0 auto", padding: "28px 24px",
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20,
    position: "relative", zIndex: 1,
  },
  leftCol: { display: "flex", flexDirection: "column", gap: 20 },
  rightCol: { display: "flex", flexDirection: "column", gap: 20 },

  card: {
    background: "rgba(20,17,13,0.8)",
    border: "1px solid rgba(180,130,60,0.15)",
    borderRadius: 8, padding: 20,
    backdropFilter: "blur(4px)",
  },
  sectionTitle: {
    display: "flex", alignItems: "center", gap: 12,
    marginBottom: 16, fontFamily: "'Courier New', monospace",
    fontSize: 13, letterSpacing: "0.08em", color: "#f0e6d3",
    borderBottom: "1px solid rgba(180,130,60,0.1)", paddingBottom: 12,
  },
  sectionNum: {
    color: "#c49a3c", fontSize: 10, fontWeight: "bold",
    background: "rgba(196,154,60,0.1)", border: "1px solid rgba(196,154,60,0.25)",
    padding: "2px 6px", borderRadius: 2,
  },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  fieldWrap: { marginBottom: 12 },
  label: {
    display: "block", marginBottom: 5,
    fontSize: 11, color: "#8a7a6a",
    fontFamily: "'Courier New', monospace", letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  hint: {
    fontSize: 11, color: "#6a5a4a",
    fontFamily: "'Courier New', monospace",
    marginBottom: 12, lineHeight: 1.5,
  },
  selectWrap: { position: "relative" },
  select: {
    width: "100%", padding: "9px 32px 9px 12px",
    background: "rgba(30,25,18,0.9)",
    border: "1px solid rgba(180,130,60,0.2)",
    borderRadius: 4, outline: "none", cursor: "pointer",
    fontSize: 13, fontFamily: "inherit",
    appearance: "none", WebkitAppearance: "none",
    transition: "border-color 0.2s",
  },
  chevron: {
    position: "absolute", right: 10, top: "50%",
    transform: "translateY(-50%)", pointerEvents: "none",
    color: "#c49a3c", fontSize: 12,
  },
  input: {
    width: "100%", padding: "9px 12px",
    background: "rgba(30,25,18,0.9)",
    border: "1px solid rgba(180,130,60,0.2)",
    borderRadius: 4, outline: "none",
    color: "#f0e6d3", fontSize: 13, fontFamily: "inherit",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%", padding: "9px 12px",
    background: "rgba(30,25,18,0.9)",
    border: "1px solid rgba(180,130,60,0.2)",
    borderRadius: 4, outline: "none", resize: "vertical",
    color: "#f0e6d3", fontSize: 13, fontFamily: "inherit",
    boxSizing: "border-box", lineHeight: 1.5,
  },

  // Upload
  uploadZone: {
    border: "1px dashed rgba(196,154,60,0.3)",
    borderRadius: 6, padding: "20px",
    textAlign: "center", cursor: "pointer",
    marginBottom: 12,
    transition: "background 0.2s",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
  },
  uploadIcon: { fontSize: 24, color: "#c49a3c" },
  uploadText: { fontSize: 12, color: "#8a7a6a", fontFamily: "'Courier New', monospace" },
  refImageCard: {
    background: "rgba(30,25,18,0.6)",
    border: "1px solid rgba(180,130,60,0.15)",
    borderRadius: 6, padding: 12, marginBottom: 10,
  },
  refImageTop: { display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 },
  refThumb: { width: 56, height: 56, objectFit: "cover", borderRadius: 4, flexShrink: 0 },
  refLabel: { fontSize: 11, color: "#c49a3c", fontFamily: "'Courier New', monospace", marginBottom: 6 },
  refDesc: {
    width: "100%", padding: "6px 8px",
    background: "rgba(14,12,10,0.8)", border: "1px solid rgba(180,130,60,0.2)",
    borderRadius: 4, color: "#f0e6d3", fontSize: 12, fontFamily: "inherit", boxSizing: "border-box",
  },
  removeBtn: {
    background: "transparent", border: "none", color: "#6a5a4a",
    cursor: "pointer", fontSize: 14, padding: "2px 6px", flexShrink: 0,
  },
  refPurposeRow: { display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" },
  purposeBtn: {
    padding: "3px 10px", fontSize: 11, borderRadius: 20,
    border: "1px solid rgba(180,130,60,0.2)", cursor: "pointer",
    background: "transparent", color: "#8a7a6a",
    fontFamily: "'Courier New', monospace", letterSpacing: "0.03em",
    transition: "all 0.15s",
  },
  purposeBtnActive: {
    background: "rgba(196,154,60,0.15)", borderColor: "rgba(196,154,60,0.5)",
    color: "#c49a3c",
  },

  // Generate button
  generateBtn: {
    width: "100%", padding: "16px",
    background: "linear-gradient(135deg, #c49a3c 0%, #8a6a20 100%)",
    border: "none", borderRadius: 6, cursor: "pointer",
    color: "#0e0c0a", fontSize: 16,
    fontFamily: "'Georgia', serif", fontWeight: "bold",
    letterSpacing: "0.04em", display: "flex", alignItems: "center",
    justifyContent: "center", gap: 10,
    transition: "opacity 0.2s",
    boxShadow: "0 4px 20px rgba(196,154,60,0.3)",
  },
  generateIcon: { fontSize: 18 },

  // Output
  outputSection: {
    maxWidth: 1300, margin: "0 auto 40px", padding: "0 24px",
    position: "relative", zIndex: 1,
  },
  outputHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-end",
    marginBottom: 12,
  },
  outputTitle: { fontSize: 18, color: "#f0e6d3", letterSpacing: "-0.01em" },
  outputMeta: { fontSize: 11, color: "#6a5a4a", fontFamily: "'Courier New', monospace", marginTop: 3 },
  outputActions: { display: "flex", gap: 10 },
  copyBtn: {
    padding: "10px 22px", background: "rgba(196,154,60,0.1)",
    border: "1px solid rgba(196,154,60,0.4)", borderRadius: 4,
    color: "#c49a3c", cursor: "pointer", fontSize: 13,
    fontFamily: "'Courier New', monospace", letterSpacing: "0.05em",
    transition: "all 0.2s",
  },
  copiedBtn: {
    padding: "10px 22px", background: "rgba(80,180,80,0.1)",
    border: "1px solid rgba(80,180,80,0.4)", borderRadius: 4,
    color: "#80c880", cursor: "pointer", fontSize: 13,
    fontFamily: "'Courier New', monospace", letterSpacing: "0.05em",
  },
  chatgptBtn: {
    padding: "10px 22px", background: "rgba(74,168,111,0.15)",
    border: "1px solid rgba(74,168,111,0.4)", borderRadius: 4,
    color: "#74c87a", textDecoration: "none", fontSize: 13,
    fontFamily: "'Courier New', monospace", letterSpacing: "0.05em",
    display: "inline-block",
  },
  outputPre: {
    background: "rgba(20,17,13,0.9)",
    border: "1px solid rgba(180,130,60,0.2)",
    borderRadius: 8, padding: 20,
    fontSize: 13, lineHeight: 1.7,
    color: "#d4c4a8", fontFamily: "'Courier New', monospace",
    whiteSpace: "pre-wrap", wordBreak: "break-word",
    margin: 0,
  },
  systemBtn: {
    padding: "10px 22px", background: "rgba(196,154,60,0.15)",
    border: "1px solid rgba(196,154,60,0.6)", borderRadius: 4,
    color: "#c49a3c", cursor: "pointer", fontSize: 13,
    fontFamily: "'Courier New', monospace", letterSpacing: "0.05em",
    transition: "all 0.2s", fontWeight: "bold",
  },
  workflowBox: {
    background: "rgba(196,154,60,0.05)",
    border: "1px solid rgba(196,154,60,0.2)",
    borderRadius: 8, padding: "16px 20px", marginBottom: 20,
  },
  workflowTitle: {
    fontSize: 12, color: "#c49a3c", fontFamily: "'Courier New', monospace",
    letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12,
    fontWeight: "bold",
  },
  workflowSteps: { display: "flex", flexDirection: "column", gap: 10 },
  workflowStep: { display: "flex", gap: 12, alignItems: "flex-start" },
  workflowNum: {
    background: "rgba(196,154,60,0.2)", border: "1px solid rgba(196,154,60,0.4)",
    color: "#c49a3c", borderRadius: 3, width: 20, height: 20,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 11, fontFamily: "'Courier New', monospace",
    fontWeight: "bold", flexShrink: 0, marginTop: 1,
  },
  workflowText: {
    fontSize: 12, color: "#8a7a6a", fontFamily: "'Courier New', monospace",
    lineHeight: 1.6,
  },
  outputTip: {
    marginTop: 12, padding: "10px 16px",
    background: "rgba(196,154,60,0.06)",
    border: "1px solid rgba(196,154,60,0.1)",
    borderRadius: 4, fontSize: 12, color: "#8a7a6a",
    fontFamily: "'Courier New', monospace",
  },
  modelInfo: {
    marginTop: 6, padding: "7px 10px",
    background: "rgba(196,154,60,0.06)",
    border: "1px solid rgba(196,154,60,0.12)",
    borderRadius: 4, display: "flex", gap: 10, alignItems: "flex-start",
  },
  modelCredits: {
    fontSize: 10, fontFamily: "'Courier New', monospace",
    color: "#c49a3c", background: "rgba(196,154,60,0.12)",
    border: "1px solid rgba(196,154,60,0.25)",
    padding: "2px 6px", borderRadius: 2, whiteSpace: "nowrap", flexShrink: 0,
  },
  modelDesc: {
    fontSize: 11, color: "#8a7a6a",
    fontFamily: "'Courier New', monospace", lineHeight: 1.5,
  },
  customInputWrap: {
    display: "flex", alignItems: "center", gap: 6,
    marginTop: 6,
    background: "rgba(196,154,60,0.06)",
    border: "1px solid rgba(196,154,60,0.3)",
    borderRadius: 4, padding: "4px 8px",
  },
  customInputIcon: { fontSize: 13, flexShrink: 0 },
  customInput: {
    flex: 1, background: "transparent", border: "none", outline: "none",
    color: "#f0e6d3", fontSize: 13, fontFamily: "inherit",
    padding: "4px 0",
  },
  customClearBtn: {
    background: "transparent", border: "none", color: "#8a7a6a",
    cursor: "pointer", fontSize: 13, padding: "0 2px", flexShrink: 0,
    lineHeight: 1,
  },
};

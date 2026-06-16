/* A1 Homestead Hub — Prop Library (single source of truth)
 *
 * Every prop is defined ONCE here as an SVG <symbol> built from the
 * Primitive Dictionary (rect, circle, ellipse, line, polygon).
 *
 * Scenes place props with:   <g class="animate-..."><use href="#prop-cow" width="..." height="..."></use></g>
 * Skins (re-coloring) work via CSS variables on the <use>:
 *   <use href="#prop-tree" style="--trunk: var(--earth-deep); --canopy: var(--earth-deep)">
 *
 * Load right after <body> opens:  <script src="../assets/props.js"></script>
 * The catalog is also exposed as window.A1_PROPS for the library viewer
 * and any automation that wants to compose scenes from inventory.
 */
(function () {
  const PROPS = [
    {
      id: 'prop-cow',
      name: 'Cow (standing)',
      role: 'Midground subject',
      anim: 'animate-breathe gentle',
      vb: [164, 110],
      skins: ['--hide', '--patch'],
      shapes:
        '<rect x="22" y="76" width="13" height="34" fill="var(--hide, var(--earth-deep, #523823))"></rect>' +
        '<rect x="104" y="76" width="13" height="34" fill="var(--hide, var(--earth-deep, #523823))"></rect>' +
        '<rect x="0" y="28" width="140" height="58" rx="22" fill="var(--hide, var(--earth-deep, #523823))"></rect>' +
        '<circle cx="50" cy="56" r="18" fill="var(--patch, rgba(244,237,225,0.25))"></circle>' +
        '<circle cx="142" cy="20" r="20" fill="var(--hide, var(--earth-deep, #523823))"></circle>'
    },
    {
      id: 'prop-cow-grazing',
      name: 'Cow (grazing)',
      role: 'Midground subject',
      anim: 'animate-breathe gentle',
      vb: [170, 110],
      skins: ['--hide', '--patch'],
      shapes:
        '<rect x="40" y="72" width="13" height="38" fill="var(--hide, var(--earth-deep, #523823))"></rect>' +
        '<rect x="130" y="72" width="13" height="38" fill="var(--hide, var(--earth-deep, #523823))"></rect>' +
        '<rect x="16" y="18" width="150" height="60" rx="24" fill="var(--hide, var(--earth-deep, #523823))"></rect>' +
        '<circle cx="64" cy="44" r="19" fill="var(--patch, rgba(244,237,225,0.25))"></circle>' +
        '<circle cx="20" cy="84" r="24" fill="var(--hide, var(--earth-deep, #523823))"></circle>'
    },
    {
      id: 'prop-cow-resting',
      name: 'Cow (resting / laying down)',
      role: 'Midground subject — folk-weather oxymoron: in rain, a laying cow means something ain\'t right',
      anim: 'animate-breathe gentle',
      vb: [164, 78],
      skins: ['--hide', '--patch'],
      shapes:
        '<rect x="0" y="26" width="140" height="52" rx="24" fill="var(--hide, var(--earth-deep, #523823))"></rect>' +
        '<rect x="22" y="64" width="70" height="14" rx="7" fill="var(--patch, rgba(244,237,225,0.25))"></rect>' +
        '<circle cx="48" cy="50" r="17" fill="var(--patch, rgba(244,237,225,0.25))"></circle>' +
        '<circle cx="142" cy="20" r="20" fill="var(--hide, var(--earth-deep, #523823))"></circle>'
    },
    {
      id: 'prop-fence',
      name: 'Fence (section)',
      role: 'Boundary — tile sections along a hill crest; posts and two rails',
      anim: '',
      vb: [120, 70],
      skins: ['--post', '--rail'],
      shapes:
        '<rect x="0" y="16" width="120" height="8" rx="4" fill="var(--rail, var(--earth, #6B4A2E))"></rect>' +
        '<rect x="0" y="40" width="120" height="8" rx="4" fill="var(--rail, var(--earth, #6B4A2E))"></rect>' +
        '<rect x="0" y="0" width="10" height="70" rx="3" fill="var(--post, var(--earth-light, #8C6845))"></rect>' +
        '<rect x="110" y="0" width="10" height="70" rx="3" fill="var(--post, var(--earth-light, #8C6845))"></rect>'
    },
    {
      id: 'prop-tractor',
      name: 'Tractor',
      role: 'Moving subject',
      anim: 'animate-roll',
      vb: [150, 135],
      skins: ['--tractor-body', '--tractor-cab', '--wheel', '--hub'],
      shapes:
        '<rect x="10" y="45" width="120" height="48" rx="8" fill="var(--tractor-body, var(--gold, #D8A24A))"></rect>' +
        '<rect x="86" y="5" width="56" height="56" rx="6" fill="var(--tractor-cab, var(--earth, #6B4A2E))"></rect>' +
        '<rect x="96" y="15" width="36" height="26" rx="4" fill="var(--hub, var(--cream-deep, #E9DEC9))"></rect>' +
        '<rect x="20" y="11" width="10" height="36" fill="var(--wheel, var(--earth-deep, #523823))"></rect>' +
        '<circle cx="114" cy="101" r="34" fill="var(--wheel, var(--earth-deep, #523823))"></circle>' +
        '<circle cx="114" cy="101" r="12" fill="var(--hub, var(--cream-deep, #E9DEC9))"></circle>' +
        '<circle cx="32" cy="109" r="22" fill="var(--wheel, var(--earth-deep, #523823))"></circle>' +
        '<circle cx="32" cy="109" r="8" fill="var(--hub, var(--cream-deep, #E9DEC9))"></circle>'
    },
    {
      id: 'prop-tree',
      name: 'Tree',
      role: 'Background / midground',
      anim: 'animate-breathe',
      vb: [140, 200],
      skins: ['--trunk', '--canopy'],
      shapes:
        '<rect x="62" y="118" width="16" height="82" fill="var(--trunk, var(--earth, #6B4A2E))"></rect>' +
        '<ellipse cx="70" cy="70" rx="64" ry="70" fill="var(--canopy, var(--green-deep, #6E7D52))"></ellipse>'
    },
    {
      id: 'prop-tree-orchard',
      name: 'Orchard tree (fruiting)',
      role: 'Midground',
      anim: 'animate-breathe',
      vb: [170, 200],
      skins: ['--trunk', '--canopy', '--fruit'],
      shapes:
        '<rect x="74" y="128" width="22" height="72" fill="var(--trunk, var(--earth, #6B4A2E))"></rect>' +
        '<ellipse cx="85" cy="88" rx="82" ry="88" fill="var(--canopy, var(--green-deep, #6E7D52))"></ellipse>' +
        '<circle cx="50" cy="58" r="9" fill="var(--fruit, var(--gold, #D8A24A))"></circle>' +
        '<circle cx="118" cy="108" r="9" fill="var(--fruit, var(--gold, #D8A24A))"></circle>' +
        '<circle cx="130" cy="42" r="8" fill="var(--fruit, var(--gold, #D8A24A))"></circle>' +
        '<circle cx="58" cy="138" r="9" fill="var(--fruit, var(--gold, #D8A24A))"></circle>'
    },
    {
      id: 'prop-flower',
      name: 'Flower',
      role: 'Foreground detail',
      anim: 'animate-breathe gentle',
      vb: [32, 80],
      skins: ['--stem', '--bloom'],
      shapes:
        '<line x1="16" y1="80" x2="16" y2="24" stroke="var(--stem, var(--green, #8A9A6B))" stroke-width="5"></line>' +
        '<circle cx="16" cy="14" r="13" fill="var(--bloom, var(--gold, #D8A24A))"></circle>'
    },
    {
      id: 'prop-barn',
      name: 'Barn',
      role: 'Background structure',
      anim: '(static)',
      vb: [260, 190],
      skins: ['--barn-wall', '--barn-roof', '--barn-trim'],
      shapes:
        '<polygon points="0,60 130,0 260,60" fill="var(--barn-roof, var(--earth-deep, #523823))"></polygon>' +
        '<rect x="20" y="60" width="220" height="130" fill="var(--barn-wall, var(--earth, #6B4A2E))"></rect>' +
        '<rect x="105" y="110" width="50" height="80" fill="var(--barn-roof, var(--earth-deep, #523823))"></rect>' +
        '<rect x="45" y="85" width="30" height="30" fill="var(--barn-trim, var(--cream-deep, #E9DEC9))"></rect>' +
        '<rect x="185" y="85" width="30" height="30" fill="var(--barn-trim, var(--cream-deep, #E9DEC9))"></rect>'
    },
    {
      id: 'prop-cloud',
      name: 'Cloud',
      role: 'Background atmosphere',
      anim: 'animate-drift slow',
      vb: [200, 70],
      skins: ['--cloud'],
      shapes:
        '<ellipse cx="70" cy="42" rx="70" ry="26" fill="var(--cloud, var(--cream-deep, #E9DEC9))"></ellipse>' +
        '<ellipse cx="135" cy="30" rx="60" ry="24" fill="var(--cloud, var(--cream-deep, #E9DEC9))"></ellipse>' +
        '<ellipse cx="168" cy="48" rx="30" ry="18" fill="var(--cloud, var(--cream-deep, #E9DEC9))"></ellipse>'
    },
    {
      id: 'prop-cloud-cumulus',
      name: 'Cloud (cumulus heap)',
      role: 'Background atmosphere — fair-weather heap cloud: flat base, puffy circle tops',
      anim: 'animate-drift slow',
      vb: [240, 120],
      skins: ['--cloud'],
      shapes:
        '<circle cx="30" cy="95" r="25" fill="var(--cloud, var(--cream-deep, #E9DEC9))"></circle>' +
        '<circle cx="75" cy="95" r="25" fill="var(--cloud, var(--cream-deep, #E9DEC9))"></circle>' +
        '<circle cx="120" cy="95" r="25" fill="var(--cloud, var(--cream-deep, #E9DEC9))"></circle>' +
        '<circle cx="165" cy="95" r="25" fill="var(--cloud, var(--cream-deep, #E9DEC9))"></circle>' +
        '<circle cx="210" cy="95" r="25" fill="var(--cloud, var(--cream-deep, #E9DEC9))"></circle>' +
        '<circle cx="60" cy="65" r="30" fill="var(--cloud, var(--cream-deep, #E9DEC9))"></circle>' +
        '<circle cx="160" cy="65" r="30" fill="var(--cloud, var(--cream-deep, #E9DEC9))"></circle>' +
        '<circle cx="110" cy="55" r="36" fill="var(--cloud, var(--cream-deep, #E9DEC9))"></circle>' +
        '<circle cx="90" cy="32" r="24" fill="var(--cloud, var(--cream-deep, #E9DEC9))"></circle>' +
        '<circle cx="136" cy="36" r="22" fill="var(--cloud, var(--cream-deep, #E9DEC9))"></circle>'
    },
    {
      id: 'prop-bird',
      name: 'Bird (gliding)',
      role: 'Sky life — two slim wing triangles in a shallow V; flock in threes',
      anim: 'animate-roll',
      vb: [80, 28],
      skins: ['--bird'],
      shapes:
        '<polygon points="0,8 40,20 40,26" fill="var(--bird, var(--earth-deep, #523823))"></polygon>' +
        '<polygon points="80,8 40,20 40,26" fill="var(--bird, var(--earth-deep, #523823))"></polygon>'
    },
    {
      id: 'prop-camel',
      name: 'Camel (two humps, Bactrian)',
      role: 'Midground subject — desert traveler; two circle humps over the body rect',
      anim: 'animate-breathe gentle',
      vb: [184, 130],
      skins: ['--hide'],
      shapes:
        '<rect x="30" y="88" width="13" height="42" fill="var(--hide, var(--gold, #D8A24A))"></rect>' +
        '<rect x="120" y="88" width="13" height="42" fill="var(--hide, var(--gold, #D8A24A))"></rect>' +
        '<circle cx="58" cy="46" r="26" fill="var(--hide, var(--gold, #D8A24A))"></circle>' +
        '<circle cx="112" cy="46" r="26" fill="var(--hide, var(--gold, #D8A24A))"></circle>' +
        '<rect x="8" y="52" width="152" height="48" rx="22" fill="var(--hide, var(--gold, #D8A24A))"></rect>' +
        '<rect x="150" y="18" width="14" height="48" rx="6" fill="var(--hide, var(--gold, #D8A24A))"></rect>' +
        '<circle cx="160" cy="14" r="14" fill="var(--hide, var(--gold, #D8A24A))"></circle>'
    },
    {
      id: 'prop-tent',
      name: 'Tent',
      role: 'Midground structure — canvas triangle with a shadowed door flap',
      anim: '(static)',
      vb: [160, 110],
      skins: ['--tent', '--door'],
      shapes:
        '<polygon points="80,0 160,110 0,110" fill="var(--tent, var(--earth-light, #8C6845))"></polygon>' +
        '<polygon points="80,30 112,110 48,110" fill="var(--door, var(--earth-deep, #523823))"></polygon>'
    },
    {
      id: 'prop-ark',
      name: 'Ark (great boat)',
      role: 'Background structure — beach it on a far dune with a slight rotate; bury the hull',
      anim: '(static)',
      vb: [220, 120],
      skins: ['--hull', '--cabin', '--roof'],
      shapes:
        '<rect x="52" y="10" width="116" height="12" rx="6" fill="var(--roof, var(--earth-deep, #523823))"></rect>' +
        '<rect x="60" y="20" width="100" height="34" rx="4" fill="var(--cabin, var(--earth-light, #8C6845))"></rect>' +
        '<polygon points="0,50 220,50 190,110 30,110" fill="var(--hull, var(--earth, #6B4A2E))"></polygon>'
    },
    {
      id: 'prop-tree-jungle',
      name: 'Jungle tree (many tops)',
      role: 'Background / midground — heaped canopies on spread branches; hang monkeys from the low canopy edges',
      anim: 'animate-breathe slow',
      vb: [260, 330],
      skins: ['--trunk', '--canopy', '--canopy2'],
      shapes:
        '<rect x="116" y="180" width="26" height="150" rx="8" fill="var(--trunk, var(--earth, #6B4A2E))"></rect>' +
        '<line x1="129" y1="215" x2="38" y2="158" stroke="var(--trunk, var(--earth, #6B4A2E))" stroke-width="12" stroke-linecap="round"></line>' +
        '<line x1="129" y1="195" x2="225" y2="150" stroke="var(--trunk, var(--earth, #6B4A2E))" stroke-width="12" stroke-linecap="round"></line>' +
        '<ellipse cx="130" cy="64" rx="74" ry="52" fill="var(--canopy2, var(--green, #8A9A6B))"></ellipse>' +
        '<ellipse cx="62" cy="122" rx="60" ry="44" fill="var(--canopy, var(--green-deep, #6E7D52))"></ellipse>' +
        '<ellipse cx="196" cy="114" rx="62" ry="46" fill="var(--canopy, var(--green-deep, #6E7D52))"></ellipse>' +
        '<ellipse cx="28" cy="172" rx="40" ry="28" fill="var(--canopy2, var(--green, #8A9A6B))"></ellipse>' +
        '<ellipse cx="232" cy="162" rx="38" ry="27" fill="var(--canopy2, var(--green, #8A9A6B))"></ellipse>' +
        '<ellipse cx="130" cy="120" rx="64" ry="46" fill="var(--canopy, var(--green-deep, #6E7D52))"></ellipse>'
    },
    {
      id: 'prop-monkey-hanging',
      name: 'Monkey (hanging by tail)',
      role: 'Canopy subject — tail curl at top hooks the branch; pair with animate-sway and a banana at the hands',
      anim: 'animate-sway',
      vb: [120, 170],
      skins: ['--hide', '--patch'],
      shapes:
        '<circle cx="60" cy="10" r="9" fill="none" stroke="var(--hide, var(--earth, #6B4A2E))" stroke-width="7"></circle>' +
        '<rect x="56" y="14" width="8" height="38" rx="4" fill="var(--hide, var(--earth, #6B4A2E))"></rect>' +
        '<line x1="46" y1="92" x2="28" y2="130" stroke="var(--hide, var(--earth, #6B4A2E))" stroke-width="9" stroke-linecap="round"></line>' +
        '<line x1="74" y1="92" x2="92" y2="130" stroke="var(--hide, var(--earth, #6B4A2E))" stroke-width="9" stroke-linecap="round"></line>' +
        '<ellipse cx="60" cy="80" rx="23" ry="32" fill="var(--hide, var(--earth, #6B4A2E))"></ellipse>' +
        '<ellipse cx="60" cy="86" rx="13" ry="20" fill="var(--patch, rgba(244,237,225,0.3))"></ellipse>' +
        '<circle cx="42" cy="124" r="6" fill="var(--hide, var(--earth, #6B4A2E))"></circle>' +
        '<circle cx="78" cy="124" r="6" fill="var(--hide, var(--earth, #6B4A2E))"></circle>' +
        '<circle cx="60" cy="130" r="19" fill="var(--hide, var(--earth, #6B4A2E))"></circle>' +
        '<circle cx="60" cy="134" r="12" fill="var(--patch, rgba(244,237,225,0.3))"></circle>'
    },
    {
      id: 'prop-banana',
      name: 'Banana',
      role: 'Foreground detail — place at a monkey\'s hands; fan three for a bunch',
      anim: '(static)',
      vb: [60, 32],
      skins: ['--banana'],
      shapes:
        '<ellipse cx="30" cy="16" rx="24" ry="8" fill="var(--banana, var(--sun-yellow, #F5D061))" transform="rotate(-16 30 16)"></ellipse>' +
        '<rect x="50" y="4" width="6" height="9" rx="2" fill="var(--earth-deep, #523823)" transform="rotate(-16 53 8)"></rect>'
    },
    {
      id: 'prop-elephant',
      name: 'Elephant',
      role: 'Foreground / midground subject — trunk rect hangs from the head circle; flip with scale(-1,1) to face left',
      anim: 'animate-breathe gentle',
      vb: [200, 150],
      skins: ['--hide', '--patch'],
      shapes:
        '<rect x="38" y="112" width="16" height="38" fill="var(--hide, var(--earth-light, #8C6845))"></rect>' +
        '<rect x="96" y="112" width="16" height="38" fill="var(--hide, var(--earth-light, #8C6845))"></rect>' +
        '<rect x="10" y="48" width="140" height="72" rx="32" fill="var(--hide, var(--earth-light, #8C6845))"></rect>' +
        '<rect x="166" y="80" width="14" height="70" rx="7" fill="var(--hide, var(--earth-light, #8C6845))"></rect>' +
        '<circle cx="158" cy="58" r="34" fill="var(--hide, var(--earth-light, #8C6845))"></circle>' +
        '<circle cx="136" cy="60" r="20" fill="var(--patch, rgba(244,237,225,0.25))"></circle>' +
        '<circle cx="170" cy="48" r="4" fill="var(--patch, rgba(244,237,225,0.5))"></circle>'
    },
    {
      id: 'prop-giraffe',
      name: 'Giraffe',
      role: 'Midground subject — tall neck rect; park the head at a canopy edge so it reads as browsing leaves',
      anim: 'animate-breathe gentle',
      vb: [150, 230],
      skins: ['--hide', '--patch'],
      shapes:
        '<rect x="30" y="180" width="12" height="50" fill="var(--hide, var(--gold, #D8A24A))"></rect>' +
        '<rect x="80" y="180" width="12" height="50" fill="var(--hide, var(--gold, #D8A24A))"></rect>' +
        '<rect x="98" y="28" width="16" height="112" rx="8" fill="var(--hide, var(--gold, #D8A24A))"></rect>' +
        '<rect x="18" y="130" width="92" height="60" rx="24" fill="var(--hide, var(--gold, #D8A24A))"></rect>' +
        '<circle cx="104" cy="4" r="4" fill="var(--hide, var(--gold, #D8A24A))"></circle>' +
        '<circle cx="120" cy="4" r="4" fill="var(--hide, var(--gold, #D8A24A))"></circle>' +
        '<circle cx="112" cy="24" r="16" fill="var(--hide, var(--gold, #D8A24A))"></circle>' +
        '<circle cx="45" cy="155" r="8" fill="var(--patch, rgba(107,74,46,0.55))"></circle>' +
        '<circle cx="75" cy="168" r="7" fill="var(--patch, rgba(107,74,46,0.55))"></circle>' +
        '<circle cx="104" cy="70" r="5" fill="var(--patch, rgba(107,74,46,0.55))"></circle>' +
        '<circle cx="106" cy="105" r="5" fill="var(--patch, rgba(107,74,46,0.55))"></circle>'
    },
    {
      id: 'prop-lion',
      name: 'Lion',
      role: 'Midground subject — mane circle behind the head; perch on a big prop-stone for the lone-rock king; flip with scale(-1,1) to face left',
      anim: 'animate-breathe gentle',
      vb: [180, 122],
      skins: ['--hide', '--mane', '--patch'],
      shapes:
        '<line x1="22" y1="62" x2="6" y2="96" stroke="var(--hide, var(--gold, #D8A24A))" stroke-width="6" stroke-linecap="round"></line>' +
        '<circle cx="5" cy="100" r="6" fill="var(--mane, var(--earth, #6B4A2E))"></circle>' +
        '<rect x="38" y="88" width="13" height="34" fill="var(--hide, var(--gold, #D8A24A))"></rect>' +
        '<rect x="106" y="88" width="13" height="34" fill="var(--hide, var(--gold, #D8A24A))"></rect>' +
        '<rect x="18" y="48" width="112" height="52" rx="22" fill="var(--hide, var(--gold, #D8A24A))"></rect>' +
        '<circle cx="138" cy="44" r="30" fill="var(--mane, var(--earth, #6B4A2E))"></circle>' +
        '<circle cx="138" cy="44" r="18" fill="var(--hide, var(--gold, #D8A24A))"></circle>' +
        '<circle cx="144" cy="50" r="8" fill="var(--patch, rgba(244,237,225,0.45))"></circle>'
    },
    {
      id: 'prop-temple',
      name: 'Temple (stepped, jungle ruin)',
      role: 'Background structure — stepped ziggurat with central stair; skin --stair/--door to the water blues for a temple-spring on the mount (hanging-gardens motif)',
      anim: '(static)',
      vb: [180, 140],
      skins: ['--temple', '--stair', '--door'],
      shapes:
        '<rect x="0" y="110" width="180" height="30" fill="var(--temple, var(--cream-deep, #E9DEC9))"></rect>' +
        '<rect x="20" y="80" width="140" height="30" fill="var(--temple, var(--cream-deep, #E9DEC9))"></rect>' +
        '<rect x="40" y="50" width="100" height="30" fill="var(--temple, var(--cream-deep, #E9DEC9))"></rect>' +
        '<rect x="65" y="20" width="50" height="34" fill="var(--temple, var(--cream-deep, #E9DEC9))"></rect>' +
        '<rect x="58" y="10" width="64" height="12" rx="4" fill="var(--stair, var(--earth-light, #8C6845))"></rect>' +
        '<rect x="78" y="50" width="24" height="90" fill="var(--stair, var(--earth-light, #8C6845))"></rect>' +
        '<rect x="82" y="26" width="16" height="24" fill="var(--door, var(--earth-deep, #523823))"></rect>'
    },
    {
      id: 'prop-pyramid',
      name: 'Pyramid',
      role: 'Background structure — two-tone faces; group in threes on the dunes; the great one\'s apex can aim a light beam at the sky',
      anim: '(static)',
      vb: [200, 150],
      skins: ['--face', '--shade'],
      shapes:
        '<polygon points="100,0 200,150 0,150" fill="var(--face, var(--earth-light, #8C6845))"></polygon>' +
        '<polygon points="100,0 200,150 100,150" fill="var(--shade, rgba(39,30,18,0.4))"></polygon>'
    },
    {
      id: 'prop-sphinx',
      name: 'Sphinx (guardian)',
      role: 'Midground subject — lion body at rest, headdress and crown; set before the pyramids, facing them',
      anim: '(static guard)',
      vb: [220, 110],
      skins: ['--hide', '--patch'],
      shapes:
        '<line x1="12" y1="100" x2="62" y2="105" stroke="var(--hide, var(--earth-light, #8C6845))" stroke-width="7" stroke-linecap="round"></line>' +
        '<ellipse cx="52" cy="60" rx="50" ry="44" fill="var(--hide, var(--earth-light, #8C6845))"></ellipse>' +
        '<ellipse cx="62" cy="94" rx="34" ry="14" fill="var(--hide, var(--earth-light, #8C6845))"></ellipse>' +
        '<rect x="30" y="58" width="130" height="38" rx="14" fill="var(--hide, var(--earth-light, #8C6845))"></rect>' +
        '<rect x="148" y="84" width="66" height="12" rx="6" fill="var(--hide, var(--earth-light, #8C6845))"></rect>' +
        '<rect x="144" y="96" width="70" height="12" rx="6" fill="var(--hide, var(--earth-light, #8C6845))"></rect>' +
        '<rect x="132" y="42" width="38" height="54" rx="12" fill="var(--hide, var(--earth-light, #8C6845))"></rect>' +
        '<rect x="144" y="26" width="48" height="30" rx="6" fill="var(--hide, var(--earth-light, #8C6845))"></rect>' +
        '<circle cx="168" cy="34" r="22" fill="var(--hide, var(--earth-light, #8C6845))"></circle>' +
        '<rect x="146" y="4" width="44" height="12" rx="4" fill="var(--hide, var(--earth-light, #8C6845))"></rect>' +
        '<circle cx="174" cy="38" r="12" fill="var(--patch, rgba(244,237,225,0.25))"></circle>'
    },
    {
      id: 'prop-stable',
      name: 'Stable (open face)',
      role: 'Background structure — open-front shelter: gable roof, two posts, dark interior wall; paint the warm glow in the scene',
      anim: '(static)',
      vb: [320, 220],
      skins: ['--roof', '--wood', '--wall'],
      shapes:
        '<rect x="26" y="80" width="268" height="140" fill="var(--wall, var(--earth-deep, #523823))"></rect>' +
        '<rect x="12" y="80" width="14" height="140" fill="var(--wood, var(--earth, #6B4A2E))"></rect>' +
        '<rect x="294" y="80" width="14" height="140" fill="var(--wood, var(--earth, #6B4A2E))"></rect>' +
        '<polygon points="160,0 320,80 0,80" fill="var(--roof, var(--earth-deep, #523823))"></polygon>'
    },
    {
      id: 'prop-manger',
      name: 'Manger (with child)',
      role: 'Foreground centerpiece — crossed legs, hay, swaddled child with a halo',
      anim: '(static)',
      vb: [110, 90],
      skins: ['--wood', '--trough', '--swaddle'],
      shapes:
        '<line x1="18" y1="88" x2="58" y2="42" stroke="var(--wood, var(--earth, #6B4A2E))" stroke-width="8" stroke-linecap="round"></line>' +
        '<line x1="58" y1="88" x2="18" y2="42" stroke="var(--wood, var(--earth, #6B4A2E))" stroke-width="8" stroke-linecap="round"></line>' +
        '<line x1="52" y1="88" x2="92" y2="42" stroke="var(--wood, var(--earth, #6B4A2E))" stroke-width="8" stroke-linecap="round"></line>' +
        '<line x1="92" y1="88" x2="52" y2="42" stroke="var(--wood, var(--earth, #6B4A2E))" stroke-width="8" stroke-linecap="round"></line>' +
        '<rect x="10" y="30" width="90" height="26" rx="6" fill="var(--trough, var(--earth-light, #8C6845))"></rect>' +
        '<ellipse cx="55" cy="30" rx="40" ry="9" fill="var(--gold-light, #E6BE7E)"></ellipse>' +
        '<ellipse cx="58" cy="22" rx="20" ry="11" fill="var(--swaddle, var(--cream-deep, #E9DEC9))"></ellipse>' +
        '<circle cx="34" cy="18" r="12" fill="none" stroke="var(--gold, #D8A24A)" stroke-width="3"></circle>' +
        '<circle cx="34" cy="20" r="9" fill="var(--gold-light, #E6BE7E)"></circle>'
    },
    {
      id: 'prop-figure',
      name: 'Figure (robed)',
      role: 'Person — hooded robe triangle + head; skin --robe per character (Mary: water-deep, Joseph: earth, kings: gold/green/earth-light)',
      anim: '(static)',
      vb: [64, 130],
      skins: ['--robe', '--skin'],
      shapes:
        '<polygon points="32,20 56,130 8,130" fill="var(--robe, var(--earth, #6B4A2E))"></polygon>' +
        '<circle cx="32" cy="14" r="15" fill="var(--robe, var(--earth, #6B4A2E))"></circle>' +
        '<circle cx="32" cy="15" r="10" fill="var(--skin, var(--gold-light, #E6BE7E))"></circle>'
    },
    {
      id: 'prop-sheep',
      name: 'Sheep',
      role: 'Midground subject — woolly circle heap with a dark face',
      anim: 'animate-breathe gentle',
      vb: [110, 80],
      skins: ['--wool', '--face'],
      shapes:
        '<rect x="24" y="56" width="8" height="24" fill="var(--face, var(--earth-deep, #523823))"></rect>' +
        '<rect x="74" y="56" width="8" height="24" fill="var(--face, var(--earth-deep, #523823))"></rect>' +
        '<ellipse cx="52" cy="42" rx="42" ry="26" fill="var(--wool, var(--cream-deep, #E9DEC9))"></ellipse>' +
        '<circle cx="20" cy="34" r="14" fill="var(--wool, var(--cream-deep, #E9DEC9))"></circle>' +
        '<circle cx="84" cy="36" r="14" fill="var(--wool, var(--cream-deep, #E9DEC9))"></circle>' +
        '<circle cx="52" cy="22" r="16" fill="var(--wool, var(--cream-deep, #E9DEC9))"></circle>' +
        '<circle cx="94" cy="28" r="12" fill="var(--face, var(--earth-deep, #523823))"></circle>'
    },
    {
      id: 'prop-donkey',
      name: 'Donkey',
      role: 'Midground subject — cow geometry with tall ears',
      anim: 'animate-breathe gentle',
      vb: [150, 110],
      skins: ['--hide', '--patch'],
      shapes:
        '<rect x="112" y="0" width="8" height="26" rx="4" fill="var(--hide, var(--earth-light, #8C6845))"></rect>' +
        '<rect x="126" y="0" width="8" height="26" rx="4" fill="var(--hide, var(--earth-light, #8C6845))"></rect>' +
        '<rect x="28" y="76" width="11" height="34" fill="var(--hide, var(--earth-light, #8C6845))"></rect>' +
        '<rect x="100" y="76" width="11" height="34" fill="var(--hide, var(--earth-light, #8C6845))"></rect>' +
        '<rect x="10" y="40" width="120" height="44" rx="18" fill="var(--hide, var(--earth-light, #8C6845))"></rect>' +
        '<circle cx="128" cy="26" r="17" fill="var(--hide, var(--earth-light, #8C6845))"></circle>' +
        '<circle cx="138" cy="32" r="9" fill="var(--patch, rgba(244,237,225,0.3))"></circle>'
    },
    {
      id: 'prop-strider',
      name: 'Water strider (bug)',
      role: 'Lesson subject — stands ON the water line; pair each foot with a dimple ellipse on the surface',
      anim: 'animate-strider-bob',
      vb: [120, 60],
      skins: ['--bug'],
      shapes:
        '<line x1="34" y1="26" x2="6" y2="52" stroke="var(--bug, var(--earth-deep, #523823))" stroke-width="3" stroke-linecap="round"></line>' +
        '<line x1="44" y1="28" x2="26" y2="56" stroke="var(--bug, var(--earth-deep, #523823))" stroke-width="3" stroke-linecap="round"></line>' +
        '<line x1="76" y1="28" x2="94" y2="56" stroke="var(--bug, var(--earth-deep, #523823))" stroke-width="3" stroke-linecap="round"></line>' +
        '<line x1="86" y1="26" x2="114" y2="52" stroke="var(--bug, var(--earth-deep, #523823))" stroke-width="3" stroke-linecap="round"></line>' +
        '<ellipse cx="60" cy="24" rx="24" ry="10" fill="var(--bug, var(--earth-deep, #523823))"></ellipse>' +
        '<circle cx="88" cy="20" r="7" fill="var(--bug, var(--earth-deep, #523823))"></circle>'
    },
    {
      id: 'prop-boat-paper',
      name: 'Paper boat',
      role: 'Lesson subject — folded paper hull; put the soap dab at the stern notch',
      anim: '(scene-driven)',
      vb: [120, 70],
      skins: ['--paper', '--fold'],
      shapes:
        '<polygon points="10,40 110,40 88,68 32,68" fill="var(--paper, var(--cream-deep, #E9DEC9))"></polygon>' +
        '<polygon points="60,4 92,40 28,40" fill="var(--paper, var(--cream-deep, #E9DEC9))"></polygon>' +
        '<polygon points="60,4 60,40 28,40" fill="var(--fold, rgba(82,56,35,0.18))"></polygon>'
    },
    {
      id: 'prop-sun',
      name: 'Sun (core)',
      role: 'Sky — pair with an inline halo circle on animate-pulse',
      anim: '(static core)',
      vb: [100, 100],
      skins: ['--sun'],
      shapes:
        '<circle cx="50" cy="50" r="50" fill="var(--sun, var(--gold, #D8A24A))"></circle>'
    },
    {
      id: 'prop-moon',
      name: 'Moon (full)',
      role: 'Sky — night subject',
      anim: 'animate-drift slow',
      vb: [100, 100],
      skins: ['--moon'],
      shapes:
        '<circle cx="50" cy="50" r="50" fill="var(--moon, var(--earth-deep, #523823))"></circle>'
    },
    {
      id: 'prop-moon-gibbous',
      name: 'Moon (3/4 gibbous)',
      role: 'Sky — night subject. Shadow circle skins to the scene sky color',
      anim: 'animate-drift slow',
      vb: [100, 100],
      skins: ['--moon', '--moon-sky'],
      shapes:
        '<circle cx="50" cy="50" r="50" fill="var(--moon, var(--cream, #F4EDE1))"></circle>' +
        '<circle cx="120" cy="36" r="50" fill="var(--moon-sky, var(--night, #342818))"></circle>'
    },
    {
      id: 'prop-moon-half',
      name: 'Moon (half)',
      role: 'Sky — night subject. Shadow rect skins to the scene sky color',
      anim: 'animate-drift slow',
      vb: [100, 100],
      skins: ['--moon', '--moon-sky'],
      shapes:
        '<circle cx="50" cy="50" r="50" fill="var(--moon, var(--cream, #F4EDE1))"></circle>' +
        '<rect x="0" y="0" width="50" height="100" fill="var(--moon-sky, var(--night, #342818))"></rect>'
    },
    {
      id: 'prop-moon-crescent',
      name: 'Moon (crescent)',
      role: 'Sky — night subject. Shadow circle skins to the scene sky color',
      anim: 'animate-drift slow',
      vb: [100, 100],
      skins: ['--moon', '--moon-sky'],
      previewStyle: '--moon: var(--gold)',
      shapes:
        '<circle cx="50" cy="50" r="50" fill="var(--moon, var(--cream, #F4EDE1))"></circle>' +
        '<circle cx="32" cy="40" r="46" fill="var(--moon-sky, var(--night, #342818))"></circle>'
    },
    {
      id: 'prop-barn-simple',
      name: 'Barn (three rects)',
      role: 'Background structure — night silhouette',
      anim: '(static)',
      vb: [240, 170],
      skins: ['--barn-wall', '--barn-roof', '--barn-door'],
      shapes:
        '<rect x="14" y="0" width="212" height="42" fill="var(--barn-roof, var(--earth-deep, #523823))"></rect>' +
        '<rect x="0" y="42" width="240" height="128" fill="var(--barn-wall, var(--earth, #6B4A2E))"></rect>' +
        '<rect x="95" y="92" width="50" height="78" fill="var(--barn-door, var(--earth-deep, #523823))"></rect>'
    },
    {
      id: 'prop-star',
      name: 'Star (twinkle)',
      role: 'Night sky detail — two triangles',
      anim: 'animate-pulse',
      vb: [40, 40],
      skins: ['--star'],
      previewStyle: '--star: var(--gold)',
      shapes:
        '<polygon points="20,2 36,30 4,30" fill="var(--star, var(--cream, #F4EDE1))"></polygon>' +
        '<polygon points="20,38 36,10 4,10" fill="var(--star, var(--cream, #F4EDE1))"></polygon>'
    },
    {
      id: 'prop-twig',
      name: 'Kindling (twigs)',
      role: 'Fire skill, step 1 — gather small dry twigs first; they catch flame easiest',
      anim: '(static)',
      vb: [64, 28],
      skins: ['--wood'],
      shapes:
        '<rect x="2" y="12" width="58" height="4" rx="2" transform="rotate(6 32 14)" fill="var(--wood, var(--earth-light, #8C6845))"></rect>' +
        '<rect x="8" y="16" width="44" height="3" rx="1.5" transform="rotate(-10 30 17)" fill="var(--wood, var(--earth, #6B4A2E))"></rect>'
    },
    {
      id: 'prop-branch',
      name: 'Branch',
      role: 'Fire skill, step 2 — finger-to-wrist thickness; feeds the young flame',
      anim: '(static)',
      vb: [130, 36],
      skins: ['--wood'],
      shapes:
        '<rect x="2" y="16" width="122" height="9" rx="4" fill="var(--wood, var(--earth, #6B4A2E))"></rect>' +
        '<rect x="58" y="6" width="42" height="6" rx="3" transform="rotate(-24 60 9)" fill="var(--wood, var(--earth-light, #8C6845))"></rect>'
    },
    {
      id: 'prop-log',
      name: 'Log (fuel wood)',
      role: 'Fire skill, step 3 — the long-burn fuel; added only once the fire is established',
      anim: '(static)',
      vb: [150, 64],
      skins: ['--bark', '--grain'],
      shapes:
        '<rect x="6" y="12" width="118" height="40" rx="18" fill="var(--bark, var(--earth, #6B4A2E))"></rect>' +
        '<circle cx="124" cy="32" r="21" fill="var(--grain, var(--earth-light, #8C6845))"></circle>' +
        '<circle cx="124" cy="32" r="10" fill="var(--cream-deep, #E9DEC9)"></circle>'
    },
    {
      id: 'prop-stone',
      name: 'Stone',
      role: 'Fire skill, step 4 — ring material; contains embers and shields from wind',
      anim: '(static)',
      vb: [64, 46],
      skins: ['--stone'],
      shapes:
        '<ellipse cx="32" cy="28" rx="29" ry="17" fill="var(--stone, var(--earth-light, #8C6845))"></ellipse>' +
        '<ellipse cx="24" cy="22" rx="12" ry="6" fill="var(--cream-deep, #E9DEC9)" opacity="0.35"></ellipse>'
    },
    {
      id: 'prop-stone-ring',
      name: 'Stone ring',
      role: 'Fire skill, step 5 — the safety wall: stones circled with a back row and front row',
      anim: '(static)',
      vb: [240, 80],
      skins: ['--stone'],
      shapes:
        '<ellipse cx="50" cy="24" rx="22" ry="13" fill="var(--stone, var(--earth-light, #8C6845))"></ellipse>' +
        '<ellipse cx="120" cy="18" rx="24" ry="14" fill="var(--stone, var(--earth-light, #8C6845))"></ellipse>' +
        '<ellipse cx="190" cy="24" rx="22" ry="13" fill="var(--stone, var(--earth-light, #8C6845))"></ellipse>' +
        '<ellipse cx="28" cy="56" rx="26" ry="16" fill="var(--stone, var(--earth-light, #8C6845))"></ellipse>' +
        '<ellipse cx="92" cy="62" rx="28" ry="17" fill="var(--stone, var(--earth-light, #8C6845))"></ellipse>' +
        '<ellipse cx="156" cy="62" rx="28" ry="17" fill="var(--stone, var(--earth-light, #8C6845))"></ellipse>' +
        '<ellipse cx="214" cy="56" rx="24" ry="15" fill="var(--stone, var(--earth-light, #8C6845))"></ellipse>'
    },
    {
      id: 'prop-teepee',
      name: 'Teepee stack',
      role: 'Fire skill, step 6 — lean kindling into a cone over the tinder nest; air feeds the core',
      anim: '(static)',
      vb: [170, 130],
      skins: ['--wood', '--tinder'],
      shapes:
        '<ellipse cx="85" cy="114" rx="30" ry="10" fill="var(--tinder, var(--cream-deep, #E9DEC9))" opacity="0.85"></ellipse>' +
        '<rect x="81" y="14" width="8" height="104" rx="3" transform="rotate(26 85 18)" fill="var(--wood, var(--earth, #6B4A2E))"></rect>' +
        '<rect x="81" y="14" width="8" height="104" rx="3" transform="rotate(-26 85 18)" fill="var(--wood, var(--earth, #6B4A2E))"></rect>' +
        '<rect x="82" y="18" width="7" height="94" rx="3" transform="rotate(11 85 20)" fill="var(--wood, var(--earth-light, #8C6845))"></rect>' +
        '<rect x="82" y="18" width="7" height="94" rx="3" transform="rotate(-11 85 20)" fill="var(--wood, var(--earth-light, #8C6845))"></rect>' +
        '<rect x="58" y="112" width="34" height="4" rx="2" transform="rotate(8 75 114)" fill="var(--wood, var(--earth-light, #8C6845))"></rect>' +
        '<rect x="80" y="116" width="32" height="4" rx="2" transform="rotate(-7 96 118)" fill="var(--wood, var(--earth, #6B4A2E))"></rect>'
    },
    {
      id: 'prop-campfire',
      name: 'Campfire (lit)',
      role: 'Fire skill, step 7 — the assembly: tinder, teepee, stone ring, flame. Pair with a scene glow on animate-pulse',
      anim: '(flame pulses in scene)',
      vb: [240, 150],
      skins: ['--stone', '--wood', '--flame', '--flame-core'],
      shapes:
        '<ellipse cx="62" cy="92" rx="22" ry="13" fill="var(--stone, var(--earth-light, #8C6845))"></ellipse>' +
        '<ellipse cx="178" cy="92" rx="22" ry="13" fill="var(--stone, var(--earth-light, #8C6845))"></ellipse>' +
        '<ellipse cx="120" cy="124" rx="34" ry="10" fill="var(--cream-deep, #E9DEC9)" opacity="0.6"></ellipse>' +
        '<polygon points="120,16 150,96 90,96" fill="var(--flame, var(--gold, #D8A24A))"></polygon>' +
        '<polygon points="120,44 138,98 102,98" fill="var(--flame-core, var(--gold-light, #E6BE7E))"></polygon>' +
        '<rect x="116" y="40" width="8" height="92" rx="3" transform="rotate(28 120 44)" fill="var(--wood, var(--earth, #6B4A2E))"></rect>' +
        '<rect x="116" y="40" width="8" height="92" rx="3" transform="rotate(-28 120 44)" fill="var(--wood, var(--earth, #6B4A2E))"></rect>' +
        '<rect x="117" y="44" width="7" height="84" rx="3" transform="rotate(12 120 46)" fill="var(--wood, var(--earth-light, #8C6845))"></rect>' +
        '<circle cx="104" cy="120" r="4" fill="var(--flame, var(--gold, #D8A24A))"></circle>' +
        '<circle cx="138" cy="118" r="3" fill="var(--flame-core, var(--gold-light, #E6BE7E))"></circle>' +
        '<ellipse cx="36" cy="118" rx="28" ry="16" fill="var(--stone, var(--earth-light, #8C6845))"></ellipse>' +
        '<ellipse cx="100" cy="128" rx="30" ry="17" fill="var(--stone, var(--earth-light, #8C6845))"></ellipse>' +
        '<ellipse cx="166" cy="128" rx="30" ry="17" fill="var(--stone, var(--earth-light, #8C6845))"></ellipse>' +
        '<ellipse cx="212" cy="118" rx="24" ry="15" fill="var(--stone, var(--earth-light, #8C6845))"></ellipse>'
    },
    {
      id: 'prop-jar-mason',
      name: 'Mason jar (preserves)',
      role: 'Foreground detail — pantry wealth; sit pairs on a crate or fence rail. Skin --contents per preserve (gold honey, earth apple butter, green pickles)',
      anim: '(static)',
      vb: [70, 100],
      skins: ['--contents', '--glass', '--lid'],
      shapes:
        '<rect x="13" y="38" width="44" height="56" rx="6" fill="var(--contents, var(--gold, #D8A24A))"></rect>' +
        '<rect x="8" y="26" width="54" height="74" rx="10" fill="var(--glass, rgba(233,222,201,0.45))"></rect>' +
        '<rect x="6" y="14" width="58" height="12" rx="4" fill="var(--lid, var(--earth-light, #8C6845))"></rect>' +
        '<rect x="12" y="6" width="46" height="9" rx="3" fill="var(--lid, var(--earth-light, #8C6845))"></rect>' +
        '<rect x="15" y="34" width="6" height="56" rx="3" fill="var(--cream, #F4EDE1)" opacity="0.5"></rect>',
    },
    {
      id: 'prop-crate',
      name: 'Crate (timber)',
      role: 'Foreground detail — harvest table; jars and produce sit on top',
      anim: '(static)',
      vb: [150, 90],
      skins: ['--wood', '--slat'],
      shapes:
        '<rect x="0" y="0" width="150" height="90" rx="6" fill="var(--wood, var(--earth, #6B4A2E))"></rect>' +
        '<rect x="10" y="12" width="130" height="20" rx="4" fill="var(--slat, var(--earth-light, #8C6845))"></rect>' +
        '<rect x="10" y="40" width="130" height="20" rx="4" fill="var(--slat, var(--earth-light, #8C6845))"></rect>' +
        '<rect x="10" y="68" width="130" height="14" rx="4" fill="var(--slat, var(--earth-light, #8C6845))"></rect>',
    },
    {
      id: 'prop-garden-bed',
      name: 'Garden bed (raised, sprouting)',
      role: 'Midground subject — timber frame, soil, five sprouts; put the whole bed on animate-breathe so the crops live',
      anim: 'animate-breathe gentle',
      vb: [240, 110],
      skins: ['--wood', '--soil', '--crop', '--bloom'],
      shapes:
        '<line x1="40" y1="62" x2="40" y2="28" stroke="var(--crop, var(--green-deep, #6E7D52))" stroke-width="5"></line>' +
        '<line x1="85" y1="62" x2="85" y2="22" stroke="var(--crop, var(--green-deep, #6E7D52))" stroke-width="5"></line>' +
        '<line x1="130" y1="62" x2="130" y2="26" stroke="var(--crop, var(--green-deep, #6E7D52))" stroke-width="5"></line>' +
        '<line x1="175" y1="62" x2="175" y2="20" stroke="var(--crop, var(--green-deep, #6E7D52))" stroke-width="5"></line>' +
        '<line x1="212" y1="62" x2="212" y2="30" stroke="var(--crop, var(--green-deep, #6E7D52))" stroke-width="5"></line>' +
        '<circle cx="40" cy="22" r="10" fill="var(--bloom, var(--green, #8A9A6B))"></circle>' +
        '<circle cx="85" cy="15" r="11" fill="var(--bloom, var(--green, #8A9A6B))"></circle>' +
        '<circle cx="130" cy="19" r="10" fill="var(--bloom, var(--green, #8A9A6B))"></circle>' +
        '<circle cx="175" cy="13" r="11" fill="var(--bloom, var(--green, #8A9A6B))"></circle>' +
        '<circle cx="212" cy="24" r="9" fill="var(--bloom, var(--green, #8A9A6B))"></circle>' +
        '<rect x="12" y="52" width="216" height="16" rx="6" fill="var(--soil, var(--earth-deep, #523823))"></rect>' +
        '<rect x="0" y="62" width="240" height="40" rx="6" fill="var(--wood, var(--earth, #6B4A2E))"></rect>' +
        '<rect x="0" y="98" width="240" height="12" rx="4" fill="var(--soil, var(--earth-deep, #523823))" opacity="0.6"></rect>',
    },
    {
      id: 'prop-tomato',
      name: 'Tomato (whole, heirloom)',
      role: 'Tutorial subject — circle fruit, ellipse leaves at the crown',
      anim: 'animate-breathe gentle',
      vb: [110, 112],
      skins: ['--fruit', '--leaf'],
      shapes:
        '<circle cx="55" cy="64" r="48" fill="var(--fruit, var(--tomato, #A8523A))"></circle>' +
        '<ellipse cx="38" cy="44" rx="14" ry="8" fill="var(--cream, #F4EDE1)" opacity="0.25" transform="rotate(-24 38 44)"></ellipse>' +
        '<rect x="51" y="2" width="8" height="16" rx="4" fill="var(--leaf, var(--green-deep, #6E7D52))"></rect>' +
        '<ellipse cx="38" cy="18" rx="16" ry="6" fill="var(--leaf, var(--green-deep, #6E7D52))" transform="rotate(-18 38 18)"></ellipse>' +
        '<ellipse cx="72" cy="18" rx="16" ry="6" fill="var(--leaf, var(--green-deep, #6E7D52))" transform="rotate(18 72 18)"></ellipse>',
    },
    {
      id: 'prop-tomato-half',
      name: 'Tomato (cut face)',
      role: 'Tutorial close-up — skin ring, flesh, two gel pockets full of seeds',
      anim: '(static; halo pulses in scene)',
      vb: [120, 120],
      skins: ['--fruit', '--flesh', '--gel'],
      shapes:
        '<circle cx="60" cy="60" r="58" fill="var(--fruit, var(--tomato, #A8523A))"></circle>' +
        '<circle cx="60" cy="60" r="48" fill="var(--flesh, var(--tomato-light, #C97A5E))"></circle>' +
        '<ellipse cx="42" cy="56" rx="18" ry="26" fill="var(--gel, var(--tomato-deep, #84402D))" opacity="0.85" transform="rotate(-14 42 56)"></ellipse>' +
        '<ellipse cx="80" cy="64" rx="17" ry="25" fill="var(--gel, var(--tomato-deep, #84402D))" opacity="0.85" transform="rotate(16 80 64)"></ellipse>' +
        '<ellipse cx="38" cy="44" rx="4" ry="6" fill="var(--seed-tan, #E2C893)" transform="rotate(-20 38 44)"></ellipse>' +
        '<ellipse cx="46" cy="60" rx="4" ry="6" fill="var(--seed-tan, #E2C893)" transform="rotate(30 46 60)"></ellipse>' +
        '<ellipse cx="40" cy="74" rx="4" ry="6" fill="var(--seed-tan, #E2C893)" transform="rotate(-40 40 74)"></ellipse>' +
        '<ellipse cx="78" cy="50" rx="4" ry="6" fill="var(--seed-tan, #E2C893)" transform="rotate(24 78 50)"></ellipse>' +
        '<ellipse cx="84" cy="68" rx="4" ry="6" fill="var(--seed-tan, #E2C893)" transform="rotate(-16 84 68)"></ellipse>' +
        '<ellipse cx="76" cy="80" rx="4" ry="6" fill="var(--seed-tan, #E2C893)" transform="rotate(44 76 80)"></ellipse>' +
        '<circle cx="60" cy="60" r="7" fill="var(--flesh, var(--tomato-light, #C97A5E))"></circle>',
    },
    {
      id: 'prop-knife',
      name: 'Kitchen knife',
      role: 'Tutorial tool — blade polygon + riveted handle; lay at a slight angle with animate-slice',
      anim: 'animate-slice',
      vb: [230, 52],
      skins: ['--blade', '--handle'],
      shapes:
        '<polygon points="0,30 138,18 150,8 150,30 16,42" fill="var(--blade, var(--cream-deep, #E9DEC9))"></polygon>' +
        '<polygon points="0,30 150,30 16,42" fill="var(--earth-light, #8C6845)" opacity="0.3"></polygon>' +
        '<rect x="148" y="14" width="80" height="20" rx="10" fill="var(--handle, var(--earth-deep, #523823))"></rect>' +
        '<circle cx="170" cy="24" r="3" fill="var(--cream-deep, #E9DEC9)" opacity="0.6"></circle>' +
        '<circle cx="200" cy="24" r="3" fill="var(--cream-deep, #E9DEC9)" opacity="0.6"></circle>',
    },
    {
      id: 'prop-seed',
      name: 'Tomato seed',
      role: 'Tutorial detail — one tan teardrop ellipse; scatter many with rotation and staggered fade-in',
      anim: 'animate-fade-in',
      vb: [22, 16],
      skins: ['--seed'],
      shapes:
        '<ellipse cx="11" cy="8" rx="9" ry="6" fill="var(--seed, var(--seed-tan, #E2C893))"></ellipse>' +
        '<ellipse cx="8" cy="7" rx="3" ry="2" fill="var(--cream, #F4EDE1)" opacity="0.6"></ellipse>',
    },
    {
      id: 'prop-cactus',
      name: 'Cactus (saguaro)',
      role: 'Background / midground — rounded-cap trunk with two raised arms; skin --cactus to night tones for silhouettes',
      anim: '(static)',
      vb: [110, 170],
      skins: ['--cactus', '--bloom'],
      shapes:
        '<rect x="10" y="44" width="18" height="56" rx="9" fill="var(--cactus, var(--green-deep, #6E7D52))"></rect>' +
        '<rect x="16" y="84" width="34" height="16" rx="8" fill="var(--cactus, var(--green-deep, #6E7D52))"></rect>' +
        '<rect x="80" y="64" width="18" height="56" rx="9" fill="var(--cactus, var(--green-deep, #6E7D52))"></rect>' +
        '<rect x="62" y="104" width="34" height="16" rx="8" fill="var(--cactus, var(--green-deep, #6E7D52))"></rect>' +
        '<rect x="44" y="16" width="24" height="154" rx="12" fill="var(--cactus, var(--green-deep, #6E7D52))"></rect>' +
        '<circle cx="56" cy="14" r="8" fill="var(--bloom, var(--gold, #D8A24A))"></circle>',
    },
    {
      id: 'prop-pony-shetland',
      name: 'Shetland pony (haltered)',
      role: 'Midground subject — stocky barrel, stub legs, shaggy mane and tail, rope halter with lead ring; stands about thigh-high to a person',
      anim: 'animate-breathe gentle',
      vb: [144, 96],
      skins: ['--coat', '--mane', '--halter'],
      shapes:
        '<ellipse cx="10" cy="48" rx="11" ry="22" fill="var(--mane, var(--earth-deep, #523823))"></ellipse>' +
        '<rect x="22" y="70" width="10" height="26" fill="var(--coat, var(--earth-light, #8C6845))"></rect>' +
        '<rect x="40" y="70" width="10" height="26" fill="var(--coat, var(--earth-light, #8C6845))"></rect>' +
        '<rect x="84" y="70" width="10" height="26" fill="var(--coat, var(--earth-light, #8C6845))"></rect>' +
        '<rect x="102" y="70" width="10" height="26" fill="var(--coat, var(--earth-light, #8C6845))"></rect>' +
        '<rect x="12" y="34" width="104" height="42" rx="20" fill="var(--coat, var(--earth-light, #8C6845))"></rect>' +
        '<circle cx="118" cy="34" r="18" fill="var(--coat, var(--earth-light, #8C6845))"></circle>' +
        '<rect x="126" y="32" width="16" height="15" rx="7" fill="var(--coat, var(--earth-light, #8C6845))"></rect>' +
        '<circle cx="92" cy="24" r="11" fill="var(--mane, var(--earth-deep, #523823))"></circle>' +
        '<circle cx="104" cy="18" r="12" fill="var(--mane, var(--earth-deep, #523823))"></circle>' +
        '<circle cx="113" cy="26" r="10" fill="var(--mane, var(--earth-deep, #523823))"></circle>' +
        '<circle cx="121" cy="16" r="9" fill="var(--mane, var(--earth-deep, #523823))"></circle>' +
        '<circle cx="124" cy="30" r="2.5" fill="var(--night-deep, #271E12)"></circle>' +
        '<line x1="126" y1="45" x2="141" y2="45" stroke="var(--halter, var(--cream-deep, #E9DEC9))" stroke-width="3" stroke-linecap="round"></line>' +
        '<line x1="130" y1="44" x2="122" y2="24" stroke="var(--halter, var(--cream-deep, #E9DEC9))" stroke-width="3" stroke-linecap="round"></line>' +
        '<circle cx="128" cy="48" r="3" fill="none" stroke="var(--halter, var(--cream-deep, #E9DEC9))" stroke-width="2"></circle>',
    },
    {
      id: 'prop-cowboy',
      name: 'Cowboy (blocky figure)',
      role: 'Person — the modern-folks template: Lego-style blocks, ten-gallon hat, denim legs (--denim maps to the water blues), pointed boots with heels; lead arm lowered to hold a rope. Faces right; flip with scale(-1,1)',
      anim: '(static)',
      vb: [96, 184],
      skins: ['--hat', '--band', '--skin', '--shirt', '--denim', '--boot'],
      shapes:
        '<rect x="16" y="64" width="11" height="46" rx="5.5" fill="var(--shirt, var(--earth, #6B4A2E))"></rect>' +
        '<rect x="27" y="108" width="15" height="62" fill="var(--denim, var(--water-deep, #5E7B8A))"></rect>' +
        '<rect x="48" y="108" width="15" height="62" fill="var(--denim, var(--water-deep, #5E7B8A))"></rect>' +
        '<rect x="23" y="168" width="27" height="15" rx="5" fill="var(--boot, var(--earth-deep, #523823))"></rect>' +
        '<rect x="23" y="177" width="9" height="7" fill="var(--boot, var(--earth-deep, #523823))"></rect>' +
        '<rect x="44" y="168" width="27" height="15" rx="5" fill="var(--boot, var(--earth-deep, #523823))"></rect>' +
        '<rect x="44" y="177" width="9" height="7" fill="var(--boot, var(--earth-deep, #523823))"></rect>' +
        '<rect x="22" y="61" width="46" height="50" rx="9" fill="var(--shirt, var(--earth, #6B4A2E))"></rect>' +
        '<rect x="62" y="64" width="11" height="52" rx="5.5" fill="var(--shirt, var(--earth, #6B4A2E))" transform="rotate(-18 67 66)"></rect>' +
        '<circle cx="83" cy="113" r="6" fill="var(--skin, var(--gold-light, #E6BE7E))"></circle>' +
        '<rect x="29" y="35" width="32" height="26" rx="7" fill="var(--skin, var(--gold-light, #E6BE7E))"></rect>' +
        '<rect x="26" y="4" width="38" height="28" rx="8" fill="var(--hat, var(--earth-deep, #523823))"></rect>' +
        '<rect x="26" y="22" width="38" height="6" fill="var(--band, var(--gold, #D8A24A))"></rect>' +
        '<rect x="8" y="26" width="74" height="9" rx="4.5" fill="var(--hat, var(--earth-deep, #523823))"></rect>',
    },
    {
      id: 'prop-chair-camp',
      name: 'Camp chair (wooden)',
      role: 'Foreground furniture — side view facing right; seat top sits at vb y≈64 for seating figures; flip with scale(-1,1)',
      anim: '(static)',
      vb: [110, 132],
      skins: ['--wood', '--wood-light'],
      shapes:
        '<rect x="6" y="0" width="12" height="78" rx="5" fill="var(--wood, var(--earth, #6B4A2E))"></rect>' +
        '<rect x="8" y="74" width="11" height="58" fill="var(--wood, var(--earth, #6B4A2E))"></rect>' +
        '<rect x="64" y="74" width="11" height="58" fill="var(--wood, var(--earth, #6B4A2E))"></rect>' +
        '<rect x="14" y="100" width="56" height="8" rx="4" fill="var(--wood-light, var(--earth-light, #8C6845))"></rect>' +
        '<rect x="4" y="64" width="74" height="12" rx="5" fill="var(--wood-light, var(--earth-light, #8C6845))"></rect>',
    },
    {
      id: 'prop-mug',
      name: 'Coffee mug',
      role: 'Hand detail — body, handle ring, coffee line; paint steam puffs in the scene on animate-pulse',
      anim: '(static)',
      vb: [44, 36],
      skins: ['--mug', '--coffee'],
      shapes:
        '<circle cx="32" cy="18" r="9" fill="none" stroke="var(--mug, var(--cream-deep, #E9DEC9))" stroke-width="5"></circle>' +
        '<rect x="2" y="4" width="26" height="28" rx="6" fill="var(--mug, var(--cream-deep, #E9DEC9))"></rect>' +
        '<rect x="6" y="8" width="18" height="5" rx="2.5" fill="var(--coffee, var(--earth-deep, #523823))"></rect>',
    },
    {
      id: 'prop-cowgirl-seated',
      name: 'Cowgirl (seated, blocky figure)',
      role: 'Person — modern-folks template, seated: ponytail, bent legs (thigh shelf at vb y≈82 rests on a chair seat), forward arm holds a mug at the hand circle (~97,74). Faces right; flip with scale(-1,1)',
      anim: '(static)',
      vb: [120, 150],
      skins: ['--hair', '--skin', '--shirt', '--denim', '--boot'],
      shapes:
        '<ellipse cx="18" cy="30" rx="10" ry="17" fill="var(--hair, var(--earth-deep, #523823))"></ellipse>' +
        '<rect x="40" y="82" width="52" height="15" rx="7" fill="var(--denim, var(--water-deep, #5E7B8A))"></rect>' +
        '<rect x="80" y="94" width="14" height="44" fill="var(--denim, var(--water-deep, #5E7B8A))"></rect>' +
        '<rect x="76" y="134" width="28" height="14" rx="5" fill="var(--boot, var(--earth-deep, #523823))"></rect>' +
        '<rect x="76" y="141" width="9" height="7" fill="var(--boot, var(--earth-deep, #523823))"></rect>' +
        '<rect x="22" y="36" width="42" height="50" rx="9" fill="var(--shirt, var(--green-deep, #6E7D52))"></rect>' +
        '<rect x="58" y="42" width="11" height="44" rx="5.5" fill="var(--shirt, var(--green-deep, #6E7D52))" transform="rotate(-50 63 44)"></rect>' +
        '<circle cx="97" cy="74" r="6" fill="var(--skin, var(--gold-light, #E6BE7E))"></circle>' +
        '<rect x="28" y="12" width="30" height="25" rx="7" fill="var(--skin, var(--gold-light, #E6BE7E))"></rect>' +
        '<rect x="26" y="4" width="34" height="14" rx="7" fill="var(--hair, var(--earth-deep, #523823))"></rect>',
    },
    {
      id: 'prop-dog',
      name: 'Dog (sitting)',
      role: 'Companion — sitting at heel: haunch ellipse, angled torso, floppy ear, gold collar. Faces right; flip with scale(-1,1)',
      anim: 'animate-breathe gentle',
      vb: [112, 108],
      skins: ['--coat', '--ears', '--collar'],
      shapes:
        '<ellipse cx="12" cy="92" rx="15" ry="7" fill="var(--coat, var(--earth-light, #8C6845))" transform="rotate(-28 12 92)"></ellipse>' +
        '<ellipse cx="36" cy="76" rx="27" ry="25" fill="var(--coat, var(--earth-light, #8C6845))"></ellipse>' +
        '<rect x="62" y="56" width="10" height="48" fill="var(--coat, var(--earth-light, #8C6845))"></rect>' +
        '<rect x="76" y="56" width="10" height="48" fill="var(--coat, var(--earth-light, #8C6845))"></rect>' +
        '<rect x="44" y="26" width="26" height="58" rx="13" fill="var(--coat, var(--earth-light, #8C6845))" transform="rotate(12 57 55)"></rect>' +
        '<circle cx="74" cy="22" r="17" fill="var(--coat, var(--earth-light, #8C6845))"></circle>' +
        '<rect x="86" y="20" width="17" height="12" rx="6" fill="var(--coat, var(--earth-light, #8C6845))"></rect>' +
        '<circle cx="101" cy="26" r="3" fill="var(--night-deep, #271E12)"></circle>' +
        '<ellipse cx="64" cy="10" rx="7" ry="12" fill="var(--ears, var(--earth-deep, #523823))" transform="rotate(-18 64 10)"></ellipse>' +
        '<rect x="60" y="40" width="22" height="6" rx="3" fill="var(--collar, var(--gold, #D8A24A))" transform="rotate(12 71 43)"></rect>',
    },
    {
      id: 'prop-lantern',
      name: 'Lantern post',
      role: 'Foreground — pair with an inline glow circle on animate-pulse',
      anim: '(static post)',
      vb: [40, 190],
      skins: ['--post', '--flame'],
      shapes:
        '<rect x="12" y="36" width="16" height="154" fill="var(--post, var(--earth-deep, #523823))"></rect>' +
        '<rect x="6" y="0" width="28" height="40" rx="6" fill="var(--post, var(--earth-deep, #523823))"></rect>' +
        '<circle cx="20" cy="20" r="9" fill="var(--flame, var(--gold, #D8A24A))"></circle>'
    }
  ];

  const defs = PROPS.map(function (p) {
    return '<symbol id="' + p.id + '" viewBox="0 0 ' + p.vb[0] + ' ' + p.vb[1] + '">' + p.shapes + '</symbol>';
  }).join('');

  document.body.insertAdjacentHTML(
    'afterbegin',
    '<svg id="prop-library" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">' + defs + '</svg>'
  );

  window.A1_PROPS = PROPS;
})();

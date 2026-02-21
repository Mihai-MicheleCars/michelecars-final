/* ============================================
   MICHELE CARS - Vue 3 + Vuetify 3 App
   ============================================ */

const { createApp, ref, reactive, computed, onMounted, onUnmounted } = Vue;

const vuetify = Vuetify.createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#f5c518',
          secondary: '#499aa2',
          accent: '#f5c518',
          surface: '#1a1a1a',
          background: '#0d0d0d',
          amber: '#f5c518',
        }
      }
    }
  },
  defaults: {
    global: {
      font: { family: 'Inter, sans-serif' }
    }
  }
});

const app = createApp({
  setup() {
    // --- State ---
    const drawer = ref(false);
    const scrolled = ref(false);
    const activeSection = ref('acasa');
    const formValid = ref(false);
    const formLoading = ref(false);
    const formStatus = ref(null);
    const contactForm = ref(null);

    const form = reactive({
      name: '',
      phone: '',
      email: '',
      service: null,
      details: '',
      consent: false
    });

    const rules = {
      required: v => !!v || 'Camp obligatoriu',
      email: v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email invalid'
    };

    const whatsappUrl = 'https://wa.me/40727124898?text=Buna%20ziua%2C%20doresc%20o%20programare%20la%20service.';

    // --- Navigation ---
    const navItems = [
      { id: 'acasa', label: 'Acasa', icon: 'mdi-home' },
      { id: 'servicii', label: 'Servicii', icon: 'mdi-wrench' },
      { id: 'preturi', label: 'Preturi', icon: 'mdi-tag' },
      { id: 'programare', label: 'Programare', icon: 'mdi-calendar' }
    ];

    const serviceOptions = [
      'Mecanica',
      'Electrica',
      'Detailing',
      'Diagnoza Computerizata',
      'Vulcanizare',
      'Magazin Piese Auto',
      'Altele'
    ];

    // --- Hero Stats ---
    const stats = [
      { value: '30+', label: 'Ani Experienta' },
      { value: '5000+', label: 'Clienti Serviti' },
      { value: '100%', label: 'Piese cu Garantie' }
    ];

    // --- Images ---
    const heroImage = 'https://images.unsplash.com/photo-1619642737579-a7474bee1044?w=1920&q=80&auto=format&fit=crop';

    // --- Services ---
    const services = [
      {
        title: 'Mecanica',
        icon: 'mdi-engine',
        color: 'amber',
        image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80&auto=format&fit=crop',
        description: 'Reparatii complexe motoare, sisteme de franare si directie. Folosim doar piese originale cu garantie.',
        items: [
          'Inlocuire kit distributie si curele',
          'Inlocuire kit ambreiaj',
          'Reparatii sistem franare si directie',
          'Curatare clapeta EGR cu initializare',
          'Inlocuire injectoare + codare',
          'Inlocuire ulei cutie viteze'
        ]
      },
      {
        title: 'Electrica',
        icon: 'mdi-flash',
        color: 'blue',
        image: 'https://images.unsplash.com/photo-1564912139097-6e35a037c77f?w=600&q=80&auto=format&fit=crop',
        description: 'Diagnosticare si reparatii sisteme electrice auto cu testere profesionale si peste 30 ani experienta.',
        items: [
          'Pornire motor – electromotor, contacte',
          'Sistem incarcare baterie – alternator',
          'Sistem iluminare – verificari, reglaje',
          'Unitati de control – senzori, relee',
          'Sistem confort – inchidere centralizata'
        ]
      },
      {
        title: 'Detailing',
        icon: 'mdi-spray',
        color: 'teal',
        image: 'https://images.unsplash.com/photo-1568945494532-cb26f0b73a8e?w=600&q=80&auto=format&fit=crop',
        description: 'Curatare profesionala tapiterie cu detergenti ecologici si lustruire faruri cu garantie 4 ani.',
        items: [
          'Spalare / argila / protectie',
          'Indepartarea zgarieturilor',
          'Restaurarea farurilor (garantie 4 ani)',
          'Restaurarea ornamentelor plastice',
          'Curatare cu abur'
        ]
      },
      {
        title: 'Diagnoza Computerizata',
        icon: 'mdi-laptop',
        color: 'purple',
        image: 'https://images.unsplash.com/photo-1581091871235-868c13b39a42?w=600&q=80&auto=format&fit=crop',
        description: 'Diagnoza completa pe toate modulele electronice ale autovehiculului cu echipamente profesionale.',
        items: [
          'Diagnoza pe toate modulele electronice',
          'Interpretarea DTC (coduri defecte)',
          'Adaptari si programari',
          'Regenerare filtru particule',
          'Citire parametri in timp real'
        ]
      },
      {
        title: 'Magazin Piese Auto',
        icon: 'mdi-store',
        color: 'orange',
        image: 'https://images.unsplash.com/photo-1635108198854-26645ffe6714?w=600&q=80&auto=format&fit=crop',
        description: 'Piese auto de la producatori renumiti, identificare exacta cu software specializat.',
        items: [
          'Piese originale si aftermarket',
          'Identificare exacta cu software specializat',
          'Comunicare rapida si simpla',
          'Preturi competitive'
        ]
      },
      {
        title: 'Vulcanizare',
        icon: 'mdi-tire',
        color: 'red',
        image: 'https://images.unsplash.com/photo-1653130891925-b12798e271f1?w=600&q=80&auto=format&fit=crop',
        description: 'Servicii complete de vulcanizare si echilibrare roti.',
        items: [
          'Schimb anvelope',
          'Echilibrare roti',
          'Reparatii pneuri',
          'In curand - detalii suplimentare'
        ]
      }
    ];

    // --- Schedule ---
    const schedule = [
      { day: 'Luni - Vineri', hours: '8:30 - 17:00', closed: false },
      { day: 'Sambata', hours: '8:30 - 13:00', closed: false },
      { day: 'Duminica / Sarbatori', hours: 'Inchis', closed: true }
    ];

    // --- Promo floating ---
    const showPromo = ref(false);
    const promoDismissed = ref(false);

    // --- Price Categories ---
    const priceCategories = [
      {
        title: 'Revizii',
        icon: 'mdi-oil',
        chipColor: 'amber',
        items: [
          { name: 'Revizie ulei, filtre si RESETARE BORD', multi: '200 lei', suv: '300 lei' },
          { name: 'Inlocuit ulei si filtru ulei', multi: '100 lei', suv: '150 lei' },
          { name: 'Inlocuit antigel', multi: '100 lei', suv: '150 lei' },
          { name: 'Inlocuit lichid de frana', multi: '150 lei', suv: '200 lei' },
          { name: 'Inlocuit ulei cutie viteze manuala', multi: '150 lei', suv: '200 lei' },
          { name: 'Inlocuit ulei servodirectie', multi: '150 lei', suv: '200 lei' },
          { name: 'Inlocuit ulei cutie transfer', multi: '150 lei', suv: '200 lei' }
        ]
      },
      {
        title: 'Sistem Franare',
        icon: 'mdi-car-brake-alert',
        chipColor: 'red',
        items: [
          { name: 'Inlocuire placute frana / punte', multi: '250 lei', suv: '300 lei' },
          { name: 'Inlocuire discuri + placute / punte', multi: '400 lei', suv: '450 lei' },
          { name: 'Inlocuire placute frana – parcare electr.', multi: '200 lei', suv: '300 lei' },
          { name: 'Inlocuire discuri + placute – parcare electr.', multi: '400 lei', suv: '450 lei' },
          { name: 'Inlocuire saboti frana', multi: '200 lei', suv: '300 lei' },
          { name: 'Inlocuire tamburi', multi: '150 lei', suv: '250 lei' },
          { name: 'Inlocuire etrier frana', multi: '150 lei', suv: '200 lei' },
          { name: 'Inlocuire cilindru receptor frana', multi: '150 lei', suv: '200 lei' },
          { name: 'Inlocuire cablu frana de mana', multi: '150 lei', suv: '250 lei' },
          { name: 'Inlocuire pompa centrala de frana', multi: '250 lei', suv: '350 lei' },
          { name: 'Inlocuire pompa servofrana', multi: '350 lei', suv: '450 lei' },
          { name: 'Inlocuire racord frana / buc', multi: '100 lei', suv: '150 lei' },
          { name: 'Aerisire sistem franare', multi: '150 lei', suv: '150 lei' }
        ]
      },
      {
        title: 'Suspensie si Directie',
        icon: 'mdi-car-wrench',
        chipColor: 'blue',
        items: [
          { name: 'Inlocuit amortizoare fata / set', multi: '500 lei', suv: '650 lei' },
          { name: 'Inlocuit amortizoare spate / set', multi: '300 lei', suv: '450 lei' },
          { name: 'Inlocuit flansa amortizor / buc', multi: '500 lei', suv: '650 lei' },
          { name: 'Inlocuit arcuri elicoidale / set - fata', multi: '500 lei', suv: '650 lei' },
          { name: 'Inlocuit arcuri elicoidale / set - spate', multi: '300 lei', suv: '450 lei' },
          { name: 'Inlocuit bieleta directie', multi: '250 lei', suv: '350 lei' },
          { name: 'Inlocuit bieleta antiruliu', multi: '150 lei', suv: '200 lei' },
          { name: 'Inlocuit cap bara', multi: '150 lei', suv: '200 lei' },
          { name: 'Inlocuit pivot', multi: '200 lei', suv: '300 lei' },
          { name: 'Inlocuit pivot cu nituri', multi: '250 lei', suv: '350 lei' },
          { name: 'Inlocuit brat (bascula)', multi: '250 lei', suv: '350 lei' },
          { name: 'Inlocuit bucsa bascula', multi: '200 lei', suv: '350 lei' },
          { name: 'Inlocuit bucse punte spate', multi: '900 lei', suv: '1.200 lei' },
          { name: 'Inlocuit punte spate', multi: '1.200 lei', suv: '1.500 lei' },
          { name: 'Inlocuit bucse bara stabilizatoare / buc', multi: '150 lei', suv: '250 lei' },
          { name: 'Inlocuit bara stabilizatoare', multi: '450 lei', suv: '550 lei' },
          { name: 'Inlocuit caseta de directie', multi: '600 lei', suv: '800 lei' },
          { name: 'Inlocuit rulment roata fata', multi: '250 lei', suv: '350 lei' },
          { name: 'Inlocuit rulment roata spate', multi: '200 lei', suv: '350 lei' }
        ]
      },
      {
        title: 'Transmisie',
        icon: 'mdi-cog-transfer',
        chipColor: 'teal',
        items: [
          { name: 'Inlocuit kit ambreiaj fara demontare cadru', multi: '600 lei', suv: '800 lei' },
          { name: 'Inlocuit kit ambreiaj cu demontare cadru', multi: '1.080 lei', suv: '1.250 lei' },
          { name: 'Inlocuit volanta', multi: '100 lei', suv: '100 lei' },
          { name: 'Inlocuit cap planetara', multi: '110 lei', suv: '135 lei' },
          { name: 'Inlocuit burduf planetara', multi: '110 lei', suv: '135 lei' },
          { name: 'Inlocuit planetara', multi: '135 lei', suv: '150 lei' },
          { name: 'Inlocuit rulment intermediar', multi: '135 lei', suv: '150 lei' },
          { name: 'Inlocuit flansa cardan', multi: '110 lei', suv: '135 lei' },
          { name: 'Inlocuit diferential', multi: '475 lei', suv: '610 lei' },
          { name: 'Inlocuit tampon cutie viteze', multi: '110 lei', suv: '135 lei' },
          { name: 'Inlocuit simering planetara', multi: '125 lei', suv: '150 lei' }
        ]
      },
      {
        title: 'Motor',
        icon: 'mdi-engine',
        chipColor: 'orange',
        items: [
          { name: 'Curatat supapa EGR', multi: '270 lei', suv: '290 lei' },
          { name: 'Inlocuit EGR', multi: '200 lei', suv: '220 lei' },
          { name: 'Inlocuit tampon motor', multi: '95 lei', suv: '135 lei' },
          { name: 'Inlocuit kit distributie - fara demontare calandra', multi: '540 lei', suv: '745 lei' },
          { name: 'Inlocuit kit distributie - cu demontare calandra', multi: '800 lei', suv: '875 lei' },
          { name: 'Inlocuit curea accesorii - fara demontare calandra', multi: '110 lei', suv: '135 lei' },
          { name: 'Inlocuit curea accesorii - cu demontare calandra', multi: '200 lei', suv: '245 lei' },
          { name: 'Inlocuit garnitura chiulasa', multi: '945 lei', suv: '1.150 lei' },
          { name: 'Inlocuit garnitura capac supape', multi: '140 lei', suv: '160 lei' },
          { name: 'Inlocuit baie ulei / etansare baie ulei', multi: '150 lei', suv: '170 lei' },
          { name: 'Inlocuit turbina', multi: '200 lei', suv: '335 lei' }
        ]
      },
      {
        title: 'Electrica',
        icon: 'mdi-flash',
        chipColor: 'yellow',
        items: [
          { name: 'Inlocuit bujii', multi: '80 lei', suv: '120 lei' },
          { name: 'Inlocuit bujii incandescente', multi: '120 lei', suv: '135 lei' },
          { name: 'Inlocuit fise bujii', multi: '55 lei', suv: '80 lei' },
          { name: 'Inlocuit bobina inductie', multi: '110 lei', suv: '135 lei' },
          { name: 'Inlocuit baterie si verificare tester', multi: '80 lei', suv: '115 lei' },
          { name: 'Inlocuit alternator', multi: '200 lei', suv: '245 lei' },
          { name: 'Inlocuit electroventilator', multi: '200 lei', suv: '245 lei' },
          { name: 'Inlocuit compresor A/C', multi: '200 lei', suv: '245 lei' }
        ]
      },
      {
        title: 'Evacuare / Esapament',
        icon: 'mdi-pipe',
        chipColor: 'grey',
        items: [
          { name: 'Inlocuit toba finala', multi: '135 lei', suv: '160 lei' },
          { name: 'Inlocuit toba intermediara', multi: '160 lei', suv: '190 lei' },
          { name: 'Inlocuit catalizator', multi: '300 lei', suv: '400 lei' },
          { name: 'Inlocuit racord flexibil prin sudura', multi: '235 lei', suv: '270 lei' }
        ]
      },
      {
        title: 'Diverse',
        icon: 'mdi-tools',
        chipColor: 'purple',
        items: [
          { name: 'Diagnoza computerizata fara stergere erori', multi: '81 lei', suv: '81 lei' },
          { name: 'Regenerare filtru particule', multi: '270 lei', suv: '340 lei' },
          { name: 'Constatare vanzare-cumparare', multi: '135 lei', suv: '135 lei' },
          { name: 'Diagnoza sistem de climatizare', multi: '100 lei', suv: '100 lei' },
          { name: 'Test compresie', multi: '135 lei', suv: '175 lei' },
          { name: 'Inlocuit termostat', multi: '110 lei', suv: '150 lei' },
          { name: 'Inlocuit radiator apa - cu demontare fata', multi: '365 lei', suv: '460 lei' },
          { name: 'Inlocuit radiator apa - fara demontare fata', multi: '340 lei', suv: '405 lei' },
          { name: 'Inlocuit radiator A/C - cu demontare fata', multi: '365 lei', suv: '460 lei' },
          { name: 'Inlocuit radiator A/C - fara demontare fata', multi: '340 lei', suv: '405 lei' }
        ]
      }
    ];

    // Add computed minPrice to each category
    priceCategories.forEach(cat => {
      const prices = cat.items.map(i => parseInt(i.multi.replace(/[^0-9]/g, '')) || 0);
      cat.minPrice = Math.min(...prices) + ' lei';
    });

    // --- Scroll handling ---
    function onScroll() {
      scrolled.value = window.scrollY > 50;

      // Show promo after scrolling past hero
      if (!promoDismissed.value) {
        showPromo.value = window.scrollY > window.innerHeight * 0.5;
      }

      // Update active section
      const sections = navItems.map(i => i.id);
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          activeSection.value = sections[i];
          break;
        }
      }
    }

    function dismissPromo() {
      showPromo.value = false;
      promoDismissed.value = true;
    }

    function scrollTo(id) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }

   // --- Form submit ---
async function submitForm() {
  if (!formValid.value) return;
  formLoading.value = true;
  formStatus.value = null;
  try {
    // preluare formular HTML real
    const formEl = contactForm.value.$el;
    const formData = new FormData(formEl);
    // trimitere către Netlify Forms
    await fetch("/", {
      method: "POST",
      body: formData,
    });
    formStatus.value = {
      type: "success",
      message: "✅ Programarea a fost trimisă cu succes! Te vom contacta în cel mai scurt timp.",
    };
    // resetarea completă a câmpurilor
    form.name = "";
    form.phone = "";
    form.email = "";
    form.service = null;
    form.details = "";
    form.consent = false;
  } catch (err) {
    console.error(err);
    formStatus.value = {
      type: "error",
      message: "⚠️ A apărut o eroare la trimitere. Te rugăm să încerci din nou sau să ne contactezi telefonic la 0727 124 898.",
    };
  } finally {
    formLoading.value = false;
  }
}
    // --- Lifecycle ---
    onMounted(() => window.addEventListener('scroll', onScroll));
    onUnmounted(() => window.removeEventListener('scroll', onScroll));

    return {
      drawer, scrolled, activeSection,
      navItems, whatsappUrl, stats, services, serviceOptions,
      schedule, priceCategories, heroImage,
      showPromo, dismissPromo,
      form, formValid, formLoading, formStatus, contactForm, rules,
      scrollTo, submitForm
    };
  }
});

app.use(vuetify);
app.mount('#app');

const logger = console;

Vue.createApp({
  data() {
    return {
      signed: false,
      url: '',
      shorten: '',
      loading: false,
    };
  },

  async mounted() {
    this.signed = true;
    this.$refs.url.focus();
  },

  methods: {
    onSubmit() {
      if (this.url.length < 20) return;
      this.loading = true;
      logger.info('url', this.url);
      const params = ['register', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: this.url }),
      }];
      fetch(...params)
      .then(res => {
        if (res.status !== 200) throw new Error(res.statusText);
        return res.json();
      })
      .then(({ id }) => {
        this.shorten = `https://ujc.jp/s/${id}`;
      })
      .catch(e => logger.error(e.message))
      .then(() => setTimeout(() => { this.loading = false; }, 1000));
    },

    onCopyToClipboard() {
      if (!navigator.clipboard) return;
      if (!this.shorten.length) return;
      navigator.clipboard.writeText(this.shorten)
      .then(() => {
        this.$refs.clipboard.classList.add('try-action');
        this.$refs.clipboard.classList.add('fa-beat-fade');
        setTimeout(() => {
          this.$refs.clipboard.classList.remove('try-action');
          this.$refs.clipboard.classList.remove('fa-beat-fade');
        }, 2500);
        logger.debug('Copied to clipboard');
      })
      .catch(e => logger.error(e.message));
    },

    onColorScheme() {
      const html = document.querySelector('html');
      html.classList.toggle('dark-scheme');
      html.classList.toggle('light-scheme');
    },
  },
}).mount('#app');

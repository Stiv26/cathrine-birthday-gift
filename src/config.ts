export const CONFIG = {
  nama: "Cathrine",
  panggilan: "Bubub",
  musik: "/music/lagu.mp3",

  game: {
    target: 13, // jumlah hati yang harus ditangkap untuk menang
  },

  quiz: [
    {
      pertanyaan: "Bentuk hidung Bubub?",
      opsi: ["Mancung", "Bulat", "Pesek", "Cinnamonroll"],
      jawabanBenar: 3, // index opsi yang benar
      pesanSalah: "Eh salah 🙈 coba lagi yaa",
    },
    {
      pertanyaan: "Berapa tisu yang dihabiskan Bubub dalam sehari?",
      opsi: ["1 lembar", "100 lembar", "Tak terhingga", "1 pohon"],
      jawabanBenar: 2,
      pesanSalah: "Yakin segitu doang? 🤭",
    },
    {
      pertanyaan: "2029 pilih siapa?",
      opsi: ["Si bolu ketan", "Prabowo", "Prabowo (lagi)", "Nanda"],
      jawabanBenar: 3,
      pesanSalah: "Hmm... salah pilih nih 😤",
    },
  ],

  // TODO: saya finalisasi kalimatnya nanti
  pertanyaanBesar: "Cathrine, kamu sayang aku gak?",

  foto: [
    { src: "/photos/foto1.jpg", caption: "TODO: caption foto 1" },
    { src: "/photos/foto2.jpg", caption: "TODO: caption foto 2" },
    { src: "/photos/foto3.jpg", caption: "TODO: caption foto 3" },
    { src: "/photos/foto4.jpg", caption: "TODO: caption foto 4" },
  ],

  // Video penutup dari Google Drive.
  // Tempel link share Drive (mis. https://drive.google.com/file/d/XXXX/view?usp=sharing)
  // ATAU URL video langsung (.mp4). Kosongkan ("") untuk lewati scene video.
  video: {
    // Placeholder video sampel (.mp4 langsung) — auto lanjut saat selesai.
    // Ganti dengan link Google Drive / URL video kamu nanti.
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
  },

  // TODO: ucapan final saya isi belakangan. Draf sementara:
  ucapanPenutup: [
    "Selamat ulang tahun, Bubub! 🎂",
    "Semoga diumurmu yang ke 23 ini kau makin hoki, rejeki melimpah supaya cepat-cepat nyusul saya, semoga panjang umur, sehat selalu, dihindari dari penyakit, dan kalau bisa hidungnya di mancungkan supaya gak bocor hehe... latihan-latihan untuk berani berkomunikasi dengan orang, ambil resiko mumpung masih muda, keep humble jangan mementingkan diri sendiri, perbanyak kawan, dan belajar membuka hati ke orang yang kau suka ya hehe... hadiahmu kali ini saya kasih buku karena saya mau kau mendapatkan pemikiran yang sama setelah membaca buku yang saya berikan ini, walaupun gak seberapa tolong di terima ya... ❤️",
  ],
} as const;

export type Scene =
  | "intro"
  | "curtain"
  | "game"
  | "quiz"
  | "question"
  | "gallery"
  | "finale"
  | "video"
  | "happybday";

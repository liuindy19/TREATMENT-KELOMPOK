/* ================================
   JAVASCRIPT LANJUTAN — SILA
   DOM, Event Handling, CRUD, localStorage
   ================================ */

// ════════════════════════════════
// HELPERS (Fungsi Pembantu)
// ════════════════════════════════
// Format tanggal ke format "DD MMMM YYYY" (contoh: "12 Januari 2024")
// Fungsi ini digunakan untuk menampilkan tanggal dengan format yang lebih user-friendly di tabel riwayat
// Input: String tanggal dalam format "YYYY-MM-DD" (contoh: "2024-01-12")
// Output: String tanggal dalam format "DD MMMM YYYY" (contoh: "12 Januari 2024")
// Ini digunakan ketika kita ingin menampilkan data
function formatTanggal(dateStr) {
    const bulan = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const d = new Date(dateStr);
    return d.getDate() + ' ' + bulan[d.getMonth()] + ' ' + d.getFullYear();
}

// ════════════════════════════════
// DATA LAYER (localStorage)
// ════════════════════════════════
// Fungsi untuk mengambil data dari localStorage
function getData() {
    const raw = localStorage.getItem('sila_data'); 
    return raw ? JSON.parse(raw) : []; 
}
// Set Item = menyimpan data ke localstorage
function saveData(data) {
    localStorage.setItem('sila_data', JSON.stringify(data)); 
}
// JSON ITU ADALAH FORMAT DATA YG DISIMPAN KE DALAM BROWSER

// ════════════════════════════════
// FORM HANDLING (TAMBAH & UBAH)
// ════════════════════════════════
function initForm() {
    const form = document.getElementById('formPengajuan');
    if (!form) return; 
// !form artinya bukan form 

// Ini untuk trigger mengedit data
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit'); 
    let editMode = false;

    // Pre-fill data lama ke dalam form jika mode edit
    if (editId) { 
        const data = getData();
        const itemToEdit = data.find(function (item) { return item.id == editId; });

    // 
        if (itemToEdit) {
            editMode = true;
            document.getElementById('nama').value = itemToEdit.nama || '';
            document.getElementById('nim').value = itemToEdit.nim || '';
            const prodiEl = document.getElementById('prodi'); // 
            if (prodiEl && itemToEdit.prodi) prodiEl.value = itemToEdit.prodi;
            const layananEl = document.getElementById('layanan');
            if (layananEl && itemToEdit.layanan) layananEl.value = itemToEdit.layanan;
            document.getElementById('tanggal').value = itemToEdit.tanggal || '';
            document.getElementById('keterangan').value = itemToEdit.keterangan || '';

            const btnSubmit = form.querySelector('button[type="submit"]'); 
            if (btnSubmit) btnSubmit.innerHTML = '✏️ Save Changes';
        }
    }

    // Event Listener: Submit Form
    form.addEventListener('submit', function (e) {

        e.preventDefault(); 
        // preventDefault = untuk mencegah form tersubmit dan pas gak isi semua data itu lgsg dikasih terminal
        // sehingga gak perlu ke reset pas gak isi data yang lengkap

        const nama = document.getElementById('nama').value.trim();
        const nim = document.getElementById('nim').value.trim();
        const prodi = document.getElementById('prodi').value;
        const layanan = document.getElementById('layanan').value;
        const tanggal = document.getElementById('tanggal').value;
        const keterangan = document.getElementById('keterangan').value.trim();
        const errorEl = document.getElementById('formError');

        errorEl.textContent = '';
        // Validasi bahwa semua inputan itu harus diisi (Masuk Ujian)

        if (!nama || !nim || !prodi || !layanan || !tanggal) {
            errorEl.textContent = '❌ Every field must be filled!'; 
            return;
        }
        // Validasi yg menyatakan bahwa NIM harus 8 digit (Masuk Ujian)
        if (nim.length !== 8 || isNaN(nim)) {
            errorEl.textContent = '❌ NIM must consist of 8 numeric digits!';
            return;
        }

        const data = getData();

        // ── CRUD LOGIKA: TAMBAH (CREATE) DIUTAMAKAN ──
        if (!editMode) {
            const item = {
                id: Date.now(),
                nama: nama,
                nim: nim,
                prodi: prodi,
                layanan: layanan,
                tanggal: tanggal,
                keterangan: keterangan
            };
            data.push(item);
        } 

        // ── CRUD LOGIKA: UBAH (UPDATE) KEDUA ──
        else {
            for (let i = 0; i < data.length; i++) {
                if (data[i].id == editId) {
                    data[i].nama = nama;
                    data[i].nim = nim;
                    data[i].prodi = prodi;
                    data[i].layanan = layanan;
                    data[i].tanggal = tanggal;
                    data[i].keterangan = keterangan;
                    break;
                }
            }
        }
        
        saveData(data);
        // Memanggil fungsi save data yang sudah ada diatas
        form.reset();
        errorEl.textContent = '';
        alert(editMode ? '✅ Change saved successfully!' : '✅ Application submitted successfully!');
        
        // Tampilkan Data di halaman riwayat setelah submit (Cek di log)
        console.log(data) // Menampilkan data ke console
        // Pindah ke halaman riwayat.html
        window.location.href ='riwayat.html';


        
    });
}


// ════════════════════════════════
// M13 - TABEL RIWAYAT & LOGIKA HAPUS
// ════════════════════════════════
function initRiwayat() { 
    const tbody = document.getElementById('tableBody');
    const emptyState = document.getElementById('emptyState');
    const dataCount = document.getElementById('dataCount');
    const btnHapusSemua = document.getElementById('btnHapusSemua');

    btnHapusSemua.style.background = "none";
    btnHapusSemua.style.color = "red" 
    if (!tbody) return; 

    renderTable();

    if (btnHapusSemua) { 
        btnHapusSemua.addEventListener('click', function () {
            if (confirm('Are you sure you want to delete all data?')) {
                saveData([]);
                renderTable();
            }
        });
    }

    function renderTable() { 
        const data = getData();

        if (dataCount) {
            dataCount.textContent = data.length + ' submission';
        }

        if (data.length === 0) {
            tbody.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            if (btnHapusSemua) btnHapusSemua.style.display = 'none';
            return;
        }

        if (emptyState) emptyState.style.display = 'none'; 
        if (btnHapusSemua) btnHapusSemua.style.display = 'inline-block'; 

        tbody.innerHTML = ''; 
        for (let i = 0; i < data.length; i++) { 
            const item = data[i];
            const tr = document.createElement('tr');

            tr.innerHTML =
                '<td>' + (i + 1) + '</td>' +
                '<td>' + item.nama + '</td>' +
                '<td>' + item.nim + '</td>' +
                '<td>' + item.layanan + '</td>' +
                '<td>' + formatTanggal(item.tanggal) + '</td>' +
                '<td>' +
                '<button class="btn-edit" data-id="' + item.id + '">✏️ Edit</button> ' +
                '<button class="btn-hapus" data-id="' + item.id + '">🗑 Delete</button>' +
                '</td>';

            tbody.appendChild(tr);
        }

        // Event Listener Tombol Edit Per Baris
        const btnEdit = document.querySelectorAll('.btn-edit');
        btnEdit.forEach(function (btn) {
            btn.addEventListener('click', function () { 
                const id = this.getAttribute('data-id');
                window.location.href = 'layanan.html?edit=' + id;
            });
        });

        // Event Listener Tombol Hapus Per Baris (DELETE)
        const btnHapus = document.querySelectorAll('.btn-hapus'); 
        btnHapus.forEach(function (btn) { 
            btn.addEventListener('click', function () {
                const id = Number(this.getAttribute('data-id'));
                if (confirm('Do you want to delete this application?')) {
                    let currentData = getData();
                    currentData = currentData.filter(function (item) { 
                        return item.id !== id; 
                    });
                    saveData(currentData); 
                    renderTable();
                }
            });
        });
    }
}

// ════════════════════════════════
// INIT (Inisialisasi)
// ════════════════════════════════

// Fungsi Loaded
document.addEventListener('DOMContentLoaded',function
    (){
        //jika halaman layanan.html (id="formPengajuan")
        if(document.getElementById('formPengajuan')){
            initForm()// Jalankan function init form()
        }
        else if (document.getElementById('tableBody')){
            initRiwayat()
        }


})


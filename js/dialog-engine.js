/**
 * Sistem Floating Modal Terpusat (Custom Dialog Engine)
 * Menggantikan alert, confirm, dan prompt bawaan browser secara global.
 */

class CustomDialogEngine {
  constructor() {
    this.container = null;
    this.initContainer();
  }

  initContainer() {
    if (document.getElementById('custom-dialog-container')) {
      this.container = document.getElementById('custom-dialog-container');
      return;
    }

    const container = document.createElement('div');
    container.id = 'custom-dialog-container';
    container.className = 'fixed inset-0 z-[9999] hidden items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md transition-opacity duration-200 opacity-0';
    document.body.appendChild(container);
    this.container = container;
  }

  show({ type = 'alert', title = 'Pemberitahuan', message = '', defaultValue = '', icon = 'info', confirmText = 'OK', cancelText = 'Batal' }) {
    return new Promise((resolve) => {
      this.initContainer();

      const icons = {
        info: '<i class="fa-solid fa-circle-info text-blue-500 text-3xl"></i>',
        success: '<i class="fa-solid fa-circle-check text-emerald-500 text-3xl"></i>',
        warning: '<i class="fa-solid fa-triangle-exclamation text-amber-500 text-3xl"></i>',
        error: '<i class="fa-solid fa-circle-xmark text-rose-500 text-3xl"></i>',
        question: '<i class="fa-solid fa-circle-question text-indigo-500 text-3xl"></i>'
      };

      const selectedIcon = icons[icon] || icons.info;

      let inputHtml = '';
      if (type === 'prompt') {
        inputHtml = `
          <div class="mt-3">
            <input type="text" id="custom-dialog-input" value="${defaultValue}" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition" placeholder="Masukkan input...">
          </div>
        `;
      }

      let buttonsHtml = '';
      if (type === 'alert') {
        buttonsHtml = `
          <button id="custom-dialog-btn-ok" class="w-full py-2.5 px-4 rounded-xl font-extrabold bg-blue-600 hover:bg-blue-500 text-white text-xs shadow-md transition active:scale-95">
            ${confirmText}
          </button>
        `;
      } else {
        buttonsHtml = `
          <button id="custom-dialog-btn-cancel" class="w-1/2 py-2.5 px-4 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition active:scale-95">
            ${cancelText}
          </button>
          <button id="custom-dialog-btn-ok" class="w-1/2 py-2.5 px-4 rounded-xl font-extrabold bg-blue-600 hover:bg-blue-500 text-white text-xs shadow-md transition active:scale-95">
            ${confirmText}
          </button>
        `;
      }

      this.container.innerHTML = `
        <div id="custom-dialog-card" class="bg-white text-slate-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100 transform scale-90 opacity-0 transition-all duration-200 ease-out space-y-4">
          <div class="flex items-start gap-3.5">
            <div class="shrink-0 pt-0.5">${selectedIcon}</div>
            <div class="space-y-1 w-full">
              <h4 class="font-extrabold text-slate-900 text-sm leading-tight">${title}</h4>
              <p class="text-xs text-slate-600 leading-relaxed font-medium">${message}</p>
              ${inputHtml}
            </div>
          </div>
          <div class="flex items-center gap-2 pt-2 border-t border-slate-100">
            ${buttonsHtml}
          </div>
        </div>
      `;

      this.container.classList.remove('hidden');
      this.container.classList.add('flex');

      setTimeout(() => {
        this.container.classList.remove('opacity-0');
        this.container.classList.add('opacity-100');
        const card = document.getElementById('custom-dialog-card');
        if (card) {
          card.classList.remove('scale-90', 'opacity-0');
          card.classList.add('scale-100', 'opacity-100');
        }

        if (type === 'prompt') {
          const inputEl = document.getElementById('custom-dialog-input');
          if (inputEl) inputEl.focus();
        }
      }, 10);

      const closeDialog = (result) => {
        const card = document.getElementById('custom-dialog-card');
        this.container.classList.remove('opacity-100');
        this.container.classList.add('opacity-0');
        if (card) {
          card.classList.remove('scale-100');
          card.classList.add('scale-90');
        }

        setTimeout(() => {
          this.container.classList.remove('flex');
          this.container.classList.add('hidden');
          this.container.innerHTML = '';
          resolve(result);
        }, 200);
      };

      const btnOk = document.getElementById('custom-dialog-btn-ok');
      const btnCancel = document.getElementById('custom-dialog-btn-cancel');

      if (btnOk) {
        btnOk.addEventListener('click', () => {
          if (type === 'prompt') {
            const inputVal = document.getElementById('custom-dialog-input')?.value ?? '';
            closeDialog(inputVal);
          } else {
            closeDialog(true);
          }
        });
      }

      if (btnCancel) {
        btnCancel.addEventListener('click', () => {
          if (type === 'prompt') {
            closeDialog(null);
          } else {
            closeDialog(false);
          }
        });
      }

      if (type === 'prompt') {
        const inputEl = document.getElementById('custom-dialog-input');
        if (inputEl) {
          inputEl.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') closeDialog(inputEl.value);
            if (e.key === 'Escape') closeDialog(null);
          });
        }
      }
    });
  }
}

const customDialog = new CustomDialogEngine();

// Overriding Dialog Bawaan Browser
window.alert = function(message, title = 'Pemberitahuan', icon = 'info') {
  return customDialog.show({ type: 'alert', title, message: String(message), icon });
};

window.confirm = function(message, title = 'Konfirmasi') {
  return customDialog.show({ type: 'confirm', title, message: String(message), icon: 'question', confirmText: 'Ya', cancelText: 'Batal' });
};

window.prompt = function(message, defaultValue = '', title = 'Input Data') {
  return customDialog.show({ type: 'prompt', title, message: String(message), defaultValue, icon: 'info', confirmText: 'Kirim', cancelText: 'Batal' });
};
(function () {
  const root = document.querySelector("#boat-configurator");

  if (!root) {
    return;
  }

  const rub = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0
  });

  const steps = [
    { id: "model", title: "Модель" },
    { id: "color", title: "Цвет" },
    { id: "comfort", title: "Салон" },
    { id: "power", title: "Мотор" },
    { id: "finish", title: "Финал" }
  ];

  const state = {
    step: 0,
    model: "3",
    power: "dvs",
    colorId: "ral-9010",
    selected: new Set(),
    quantities: {},
    client: {
      name: "",
      phone: "",
      email: "",
      city: "",
      comment: ""
    }
  };

  const models = {
    "3": {
      title: "Privé 4.0, 3 места",
      basePrice: 1399000,
      included: [
        "Корпус: композитный сэндвич, тримаран, 4 x 1,5 м, грузоподъемность 350 кг",
        "Салон: два кресла, спинка и заднее сиденье, выбор цветов",
        "Хром-пакет, привальный брус с нержавеющей вставкой",
        "Электрика, лобовое стекло, управление, трюмная помпа",
        "Тент стояночный, отделка пайола Эвотик"
      ]
    },
    "4": {
      title: "Privé 4.0, 4 места",
      basePrice: 1549000,
      included: [
        "Корпус: композитный сэндвич, тримаран, 4 x 1,5 м, грузоподъемность 350 кг",
        "Салон: два кресла, спинка и заднее сиденье, центральная консоль с подстаканниками",
        "Хром-пакет, привальный брус с нержавеющей вставкой",
        "Электрика, лобовое стекло, управление, трюмная помпа",
        "Тент стояночный, отделка пайола Эвотик"
      ]
    }
  };

  const electricKit = {
    id: "electric-kit",
    name: "Комплект электрооборудования Ellisabeth 9,9",
    description: "Электромотор, дистанционное управление, 2 АКБ Li NMC 5,5 кВт*ч, зарядное устройство 2 кВт и установка.",
    price: 1140000,
    quantity: 1
  };

  const ralColors = [
    { id: "ral-1015", code: "RAL 1015", name: "Light Ivory", image: "1 раздел выбор цвета борта и палубы/1 раздел каталог ral/ral 1015.png" },
    { id: "ral-3005", code: "RAL 3005", name: "Wine Red", image: "1 раздел выбор цвета борта и палубы/1 раздел каталог ral/ral 3005.png" },
    { id: "ral-5004", code: "RAL 5004", name: "Black Blue", image: "1 раздел выбор цвета борта и палубы/1 раздел каталог ral/ral 5004.png" },
    { id: "ral-6009", code: "RAL 6009", name: "Fir Green", image: "1 раздел выбор цвета борта и палубы/1 раздел каталог ral/ral 6009.png" },
    { id: "ral-7016", code: "RAL 7016", name: "Anthracite Grey", image: "1 раздел выбор цвета борта и палубы/1 раздел каталог ral/ral 7016.png" },
    { id: "ral-7038", code: "RAL 7038", name: "Agate Grey", image: "1 раздел выбор цвета борта и палубы/1 раздел каталог ral/ral 7038.png" },
    { id: "ral-9005", code: "RAL 9005", name: "Jet Black", image: "1 раздел выбор цвета борта и палубы/1 раздел каталог ral/ral 9005.png" },
    { id: "ral-9010", code: "RAL 9010", name: "Pure White", image: "1 раздел выбор цвета борта и палубы/1 раздел каталог ral/ral 9010.png" }
  ];

  const options = [
    { id: "body-color", group: "color", name: "Цвет корпуса по RAL", description: "Выбор цвета корпуса лодки по каталогу RAL.", priceByModel: { "3": 50000, "4": 50000 }, hidden: true },
    { id: "deck-color", group: "color", name: "Цвет палубы", description: "Отдельный выбор цвета палубы для версии 4 места.", priceByModel: { "4": 25000 } },
    { id: "glass-frame", group: "comfort", name: "Декоративное обрамление стекла", description: "Полированная алюминиевая рамочка для стекла из поликарбоната.", priceByModel: { "3": 30000, "4": 30000 } },
    { id: "cupholders", group: "comfort", name: "Подстаканники", description: "Откидные нержавеющие подстаканники.", priceByModel: { "3": 6500, "4": 6500 }, quantity: true, min: 1, max: 8 },
    { id: "rgb-light", group: "comfort", name: "Контурная подсветка салона", description: "Светодиодная RGB подсветка по контуру кокпита.", priceByModel: { "3": 30000, "4": 30000 } },
    { id: "music", group: "comfort", name: "Музыкальная подготовка", description: "Морская магнитола и 2 динамика.", priceByModel: { "3": 50000, "4": 60000 } },
    { id: "cleats", group: "comfort", name: "Швартовые утки Privé", description: "Эксклюзивные швартовые утки, комплект 4 шт.", priceByModel: { "3": 40000, "4": 40000 } },
    { id: "dash-gauges", group: "comfort", name: "Приборы торпеды", description: "Спидометр, тахометр, часы.", priceByModel: { "3": 30000, "4": 30000 } },
    { id: "exclusive-salon", group: "comfort", name: "Эксклюзивный салон", description: "Измененная строчка, карманы в спинке, измененный дизайн.", priceByModel: { "4": 30000 } },
    { id: "dvs-install", group: "power", power: "dvs", name: "Для ДВС", description: "Установка ДВС, дистанционного управления, троса и АКБ 12В.", priceByModel: { "3": 60000, "4": 60000 } },
    { id: "dvs-motor", group: "power", power: "dvs", name: "ДВС 9,9/20", description: "Лодочный мотор на выбор заказчика: Suzuki или Tohatsu.", priceByModel: { "3": 390000, "4": 390000 } },
    { id: "electric-lockers", group: "power", power: "electric", name: "Рундуки под дополнительные АКБ", description: "Увеличенные рундуки под 3 и более модулей АКБ.", priceByModel: { "3": 30000, "4": 40000 } },
    { id: "leg-l", group: "power", power: "electric", name: "Длина ноги L - 508 мм", description: "Опциональная установка редуктора под транец L.", priceByModel: { "3": 50000, "4": 50000 } },
    { id: "charger-33", group: "power", power: "electric", name: "Зарядное устройство 3,3 кВт", description: "Зарядное устройство 40 А, время заряда одного модуля до 2 часов.", priceByModel: { "3": 95000, "4": 95000 } },
    { id: "electric-transom", group: "power", power: "electric", name: "Выносной регулируемый транец SEA-PRO", description: "Электротрим с выносным пультом, транец и установка.", priceByModel: { "3": 85000, "4": 85000 } },
    { id: "prop-12", group: "power", power: "electric", name: "Алюминиевый винт Solas 12 шаг", description: "Винт Solas 12 шаг с установкой.", priceByModel: { "3": 12000, "4": 12000 } },
    { id: "motor-cover", group: "power", power: "electric", name: "Чехол на электромотор", description: "Защитный чехол по размеру S и L.", priceByModel: { "3": 6500, "4": 6500 } },
    { id: "lifepo", group: "power", power: "electric", name: "АКБ 12 В LiFePO4", description: "Легкий аккумулятор 12В на 30 Ач для бортового питания.", priceByModel: { "3": 20000, "4": 20000 }, quantity: true, min: 1, max: 4 },
    { id: "cable-10", group: "power", power: "electric", name: "Удлинитель зарядного кабеля 10 м", description: "Кабель 10 метров с вилкой по выбору.", priceByModel: { "3": 8000, "4": 8000 }, quantity: true, min: 1, max: 3 },
    { id: "stainless-prop", group: "power", power: "electric", name: "Винт нержавейка Solas", description: "Улучшенные характеристики и больший упор.", priceByModel: { "3": 28000, "4": 28000 } },
    { id: "life-vest", group: "power", power: "electric", name: "Автоматический спасательный жилет", description: "Компактный жилет с автоматическим надуванием в воде.", priceByModel: { "3": 5200, "4": 5200 }, quantity: true, min: 1, max: 8 },
    { id: "generator", group: "power", power: "electric", name: "Бензиновый генератор", description: "Инверторный генератор 2,5-3 кВт для экстренной подзарядки АКБ.", priceByModel: { "3": 58000, "4": 58000 } },
    { id: "trailer", group: "finish", name: "Прицеп", description: "Одноосный прицеп до 750 кг, не требует категории Е.", priceByModel: { "3": 80000, "4": 90000 } },
    { id: "mooring", group: "finish", name: "Швартовый набор", description: "Швартовые концы, весло или весло-багор, кранцы.", priceByModel: { "3": 25000, "4": 25000 } },
    { id: "deck-teak", group: "finish", exclusive: "deck-finish", name: "Отделка палубы: искусственный тик", description: "Отделка палубы искусственным тиком.", priceByModel: { "3": 150000, "4": 150000 } },
    { id: "deck-evotik", group: "finish", exclusive: "deck-finish", name: "Отделка палубы: Эвотик", description: "Отделка палубы материалом Эвотик.", priceByModel: { "3": 100000, "4": 100000 } },
    { id: "deck-veneer", group: "finish", exclusive: "deck-finish", name: "Отделка палубы: шпон", description: "Отделка палубы шпоном.", priceByModel: { "3": 400000, "4": 400000 } },
    { id: "floor-teak", group: "finish", exclusive: "floor-finish", name: "Отделка пайола: искусственный тик", description: "Отделка пайола искусственным тиком.", priceByModel: { "3": 100000, "4": 100000 } },
    { id: "floor-carpet", group: "finish", exclusive: "floor-finish", name: "Отделка пайола: морской ковролин", description: "Морской ковролин для пайола.", priceByModel: { "3": 50000, "4": 50000 } },
    { id: "panel-veneer", group: "finish", name: "Отделка панели шпоном", description: "Для 3 мест: приборная панель и кормовой люк. Для 4 мест: накладка на торпеду.", priceByModel: { "3": 250000, "4": 100000 } },
    { id: "transport-cover", group: "finish", name: "Тент транспортировочный", description: "Закрывает всю лодку во время перевозки на прицепе.", priceByModel: { "3": 40000, "4": 40000 } },
    { id: "delivery", group: "finish", name: "Доставка", description: "Доставка катера в регионы от указанной суммы.", priceByModel: { "3": 40000, "4": 40000 } }
  ];

  const optionGroups = ["color", "comfort", "power", "finish"];
  const preview = root.querySelector("[data-preview]");
  const previewCaption = root.querySelector("[data-preview-caption]");
  const requestNote = root.querySelector("[data-request-note]");

  function getOptionPrice(option) {
    return option.priceByModel[state.model];
  }

  function getQuantity(option) {
    return option.quantity ? state.quantities[option.id] || option.min || 1 : 1;
  }

  function getOptionTotal(option) {
    return getOptionPrice(option) * getQuantity(option);
  }

  function isOptionAvailable(option) {
    return getOptionPrice(option) !== undefined && (!option.power || option.power === state.power);
  }

  function formatPrice(price) {
    return rub.format(price).replace(/\u00a0/g, " ");
  }

  function getSelectedColor() {
    return ralColors.find((color) => color.id === state.colorId) || ralColors[7];
  }

  function getOfferNumber() {
    const now = new Date();
    const stamp = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
      String(now.getHours()).padStart(2, "0"),
      String(now.getMinutes()).padStart(2, "0")
    ].join("");
    return `AM-${stamp}`;
  }

  function setActiveSection(sectionId) {
    const index = steps.findIndex((step) => step.id === sectionId);
    state.step = index >= 0 ? index : 0;

    root.querySelectorAll("[data-section-button]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.sectionButton === steps[state.step].id);
    });

    root.querySelectorAll("[data-section]").forEach((section) => {
      section.classList.toggle("is-active", section.dataset.section === steps[state.step].id);
    });

    root.querySelector("[data-step-label]").textContent = `Шаг ${state.step + 1} из ${steps.length}`;
    root.querySelector("[data-step-title]").textContent = steps[state.step].title;
    root.querySelector("[data-progress-fill]").style.width = `${((state.step + 1) / steps.length) * 100}%`;
    root.querySelector("[data-prev-step]").disabled = state.step === 0;
    root.querySelector("[data-next-step]").textContent = state.step === steps.length - 1 ? "К итогу" : "Далее";
  }

  function renderColorCatalog() {
    const container = root.querySelector("[data-color-catalog]");
    if (!container) {
      return;
    }

    container.innerHTML = ralColors.map((color) => {
      const active = color.id === state.colorId ? " is-selected" : "";
      return `
        <button class="color-card${active}" type="button" data-ral="${color.id}">
          <img src="${color.image}" alt="${color.code} - ${color.name}">
          <span>${color.code}</span>
          <small>${color.name}</small>
        </button>
      `;
    }).join("");
  }

  function renderOptions() {
    optionGroups.forEach((group) => {
      const container = root.querySelector(`[data-options="${group}"]`);
      if (!container) {
        return;
      }

      const available = options.filter((option) => !option.hidden && option.group === group && isOptionAvailable(option));
      container.innerHTML = available.map((option) => {
        const checked = state.selected.has(option.id) ? "checked" : "";
        const qty = getQuantity(option);
        const qtyControl = option.quantity ? `
          <div class="qty-control" aria-label="Количество">
            <button class="qty-button" type="button" data-qty-minus="${option.id}">-</button>
            <span class="qty-value">${qty}</span>
            <button class="qty-button" type="button" data-qty-plus="${option.id}">+</button>
          </div>
        ` : "";
        const price = option.quantity ? `${formatPrice(getOptionPrice(option))} x ${qty}` : formatPrice(getOptionPrice(option));

        return `
          <label class="option-card">
            <input type="checkbox" data-option-id="${option.id}" ${checked}>
            <span>
              <strong>${option.name}</strong>
              <small>${option.description}</small>
              <b>${price}</b>
              ${qtyControl}
            </span>
          </label>
        `;
      }).join("");
    });
  }

  function renderBase() {
    const model = models[state.model];
    root.querySelector("[data-base-title]").textContent = model.title;
    root.querySelector("[data-base-price]").textContent = formatPrice(model.basePrice);
    root.querySelector("[data-base-list]").innerHTML = model.included.map((item) => `<li>${item}</li>`).join("");
  }

  function getSelectedOptions() {
    return options.filter((option) => state.selected.has(option.id) && isOptionAvailable(option));
  }

  function calculate() {
    const base = models[state.model].basePrice;
    const selectedOptions = getSelectedOptions();
    const selectedOptionsTotal = selectedOptions.reduce((sum, option) => sum + getOptionTotal(option), 0);
    const powerTotal = state.power === "electric" ? electricKit.price : 0;

    return {
      base,
      selectedOptions,
      selectedOptionsTotal,
      powerTotal,
      total: base + selectedOptionsTotal + powerTotal
    };
  }

  function getCommercialOfferItems() {
    const totals = calculate();
    const color = getSelectedColor();
    const items = [
      {
        name: `Базовая лодка ${models[state.model].title}`,
        description: "Композитный корпус, базовая комплектация Privé 4.0",
        price: totals.base,
        quantity: 1,
        total: totals.base
      }
    ];

    if (state.power === "electric") {
      items.push({
        name: electricKit.name,
        description: electricKit.description,
        price: electricKit.price,
        quantity: 1,
        total: electricKit.price
      });
    }

    totals.selectedOptions.forEach((option) => {
      const quantity = getQuantity(option);
      items.push({
        name: option.id === "body-color" ? `Цвет корпуса: ${color.code} - ${color.name}` : option.name,
        description: option.description,
        price: getOptionPrice(option),
        quantity,
        total: getOptionTotal(option)
      });
    });

    return items;
  }

  function renderSummary() {
    const model = models[state.model];
    const totals = calculate();
    const selectedList = root.querySelector("[data-selected-list]");
    const powerLabel = state.power === "electric" ? "Электро, Ellisabeth 9,9" : "ДВС";
    const color = getSelectedColor();
    const selectedItems = [...totals.selectedOptions];

    if (state.power === "electric") {
      selectedItems.unshift(electricKit);
    }

    root.querySelector("[data-summary-model]").textContent = model.title;
    root.querySelector("[data-summary-power]").textContent = powerLabel;
    root.querySelector("[data-summary-color]").textContent = `${color.code} - ${color.name}`;
    root.querySelector("[data-summary-base]").textContent = formatPrice(totals.base);
    root.querySelector("[data-summary-options]").textContent = formatPrice(totals.selectedOptionsTotal + totals.powerTotal);
    root.querySelector("[data-summary-total]").textContent = formatPrice(totals.total);

    selectedList.innerHTML = selectedItems.length
      ? selectedItems.map((item) => {
        const option = item.id === "electric-kit" ? item : options.find((entry) => entry.id === item.id);
        const name = item.id === "body-color" ? `Цвет корпуса: ${color.code} - ${color.name}` : item.name;
        const qty = option && option.quantity ? ` x ${getQuantity(option)}` : "";
        const price = item.id === "electric-kit" ? item.price : getOptionTotal(item);
        return `<li>${name}${qty} — ${formatPrice(price)}</li>`;
      }).join("")
      : "<li>Без дополнительных опций</li>";

    preview.src = color.image;
    preview.alt = `${model.title}, ${color.code} - ${color.name}`;
    previewCaption.textContent = `${model.title}, ${color.code} - ${color.name}, ${powerLabel.toLowerCase()}`;
    requestNote.textContent = "";
  }

  function removeUnavailableSelections() {
    options.forEach((option) => {
      if (!isOptionAvailable(option)) {
        state.selected.delete(option.id);
      }
    });
  }

  function syncClientFields() {
    root.querySelectorAll("[data-client-field]").forEach((field) => {
      state.client[field.dataset.clientField] = field.value.trim();
    });
  }

  function render() {
    removeUnavailableSelections();
    renderBase();
    renderColorCatalog();
    renderOptions();
    renderSummary();
    setActiveSection(steps[state.step].id);
  }

  function buildApplicationText() {
    syncClientFields();
    const totals = calculate();
    const color = getSelectedColor();
    const powerLabel = state.power === "electric" ? "Электро, Ellisabeth 9,9" : "ДВС";
    const clientLines = [
      state.client.name && `Имя: ${state.client.name}`,
      state.client.phone && `Телефон: ${state.client.phone}`,
      state.client.email && `Email: ${state.client.email}`,
      state.client.city && `Город: ${state.client.city}`,
      state.client.comment && `Комментарий: ${state.client.comment}`
    ].filter(Boolean);

    return [
      "Заявка из конфигуратора Арт-Марин",
      `Модель: ${models[state.model].title}`,
      `Силовая установка: ${powerLabel}`,
      `Цвет: ${color.code} - ${color.name}`,
      `Итого: ${formatPrice(totals.total)}`,
      "",
      "Клиент:",
      clientLines.length ? clientLines.join("\n") : "Данные не заполнены",
      "",
      "Комплектация:",
      getCommercialOfferItems().map((item) => `${item.name} x ${item.quantity} — ${formatPrice(item.total)}`).join("\n")
    ].join("\n");
  }

  async function copyApplicationText() {
    const text = buildApplicationText();

    try {
      await navigator.clipboard.writeText(text);
      requestNote.textContent = "Заявка скопирована. Ее можно отправить менеджеру в Telegram, WhatsApp или по почте.";
    } catch (error) {
      requestNote.textContent = text;
    }
  }

  function downloadCommercialOfferPdf() {
    syncClientFields();

    if (!window.pdfMake) {
      requestNote.textContent = "PDF-модуль не загрузился. Проверьте интернет и попробуйте еще раз.";
      return;
    }

    const totals = calculate();
    const color = getSelectedColor();
    const powerLabel = state.power === "electric" ? "Электро, Ellisabeth 9,9" : "ДВС";
    const items = getCommercialOfferItems();
    const offerNumber = getOfferNumber();
    const today = new Date().toLocaleDateString("ru-RU");
    const clientRows = [
      state.client.name && `Клиент: ${state.client.name}`,
      state.client.phone && `Телефон: ${state.client.phone}`,
      state.client.email && `Email: ${state.client.email}`,
      state.client.city && `Город: ${state.client.city}`,
      state.client.comment && `Комментарий: ${state.client.comment}`
    ].filter(Boolean);

    const rows = [
      [
        { text: "Позиция", bold: true },
        { text: "Описание", bold: true },
        { text: "Кол-во", bold: true, alignment: "center" },
        { text: "Сумма", bold: true, alignment: "right" }
      ],
      ...items.map((item) => [
        item.name,
        item.description,
        { text: String(item.quantity), alignment: "center" },
        { text: formatPrice(item.total), alignment: "right" }
      ])
    ];

    const documentDefinition = {
      pageSize: "A4",
      pageMargins: [36, 40, 36, 40],
      content: [
        {
          columns: [
            { text: "AM", style: "pdfLogo" },
            {
              width: "*",
              stack: [
                { text: "Арт-Марин", style: "pdfBrand" },
                { text: "Конфигуратор Privé 4.0", style: "pdfBrandSub" }
              ]
            },
            {
              width: 150,
              stack: [
                { text: `КП ${offerNumber}`, alignment: "right", bold: true },
                { text: `Дата: ${today}`, alignment: "right", color: "#666666" }
              ]
            }
          ],
          columnGap: 12,
          margin: [0, 0, 0, 18]
        },
        { text: "Коммерческое предложение", style: "title" },
        { text: "Privé 4.0", style: "subtitle" },
        {
          columns: [
            {
              width: "*",
              stack: [
                { text: `Модель: ${models[state.model].title}` },
                { text: `Силовая установка: ${powerLabel}` },
                { text: `Цвет корпуса: ${color.code} - ${color.name}` },
                ...(clientRows.length ? [{ text: "\nДанные клиента", bold: true }, ...clientRows.map((line) => ({ text: line }))] : [])
              ]
            },
            {
              width: 160,
              stack: [
                { text: "Итого", alignment: "right", color: "#666666" },
                { text: formatPrice(totals.total), style: "total", alignment: "right" }
              ]
            }
          ],
          margin: [0, 0, 0, 18]
        },
        {
          image: color.image,
          width: 420,
          alignment: "center",
          margin: [0, 0, 0, 8]
        },
        {
          text: `Выбранный цвет корпуса: ${color.code} - ${color.name}`,
          alignment: "center",
          bold: true,
          margin: [0, 0, 0, 18]
        },
        {
          table: {
            headerRows: 1,
            widths: ["30%", "*", "12%", "20%"],
            body: rows
          },
          layout: {
            fillColor: (rowIndex) => rowIndex === 0 ? "#eeeeee" : null,
            hLineColor: () => "#d8d8d8",
            vLineColor: () => "#d8d8d8"
          }
        },
        {
          text: `Итоговая стоимость: ${formatPrice(totals.total)}`,
          style: "grandTotal"
        },
        {
          text: "Стоимость носит информационный характер. Финальные условия уточняются при оформлении заказа.",
          style: "note"
        }
      ],
      styles: {
        pdfLogo: { fontSize: 20, bold: true, color: "#ffffff", background: "#111111", alignment: "center", margin: [0, 7, 0, 0] },
        pdfBrand: { fontSize: 18, bold: true, color: "#111111", margin: [0, 0, 0, 2] },
        pdfBrandSub: { fontSize: 9, color: "#666666" },
        title: { fontSize: 22, bold: true, margin: [0, 0, 0, 4] },
        subtitle: { fontSize: 16, color: "#111111", margin: [0, 0, 0, 18] },
        total: { fontSize: 18, bold: true, color: "#111111" },
        grandTotal: { fontSize: 16, bold: true, alignment: "right", margin: [0, 18, 0, 8] },
        note: { fontSize: 9, color: "#666666", margin: [0, 18, 0, 0] }
      },
      defaultStyle: {
        font: "Roboto",
        fontSize: 10,
        lineHeight: 1.25
      }
    };

    pdfMake.createPdf(documentDefinition).download(`${offerNumber}-Prive-4-0.pdf`);
    requestNote.textContent = `PDF создан. Итоговая стоимость: ${formatPrice(totals.total)}.`;
  }

  root.addEventListener("click", (event) => {
    const tabButton = event.target.closest("[data-section-button]");
    const modelButton = event.target.closest("[data-model]");
    const powerButton = event.target.closest("[data-power]");
    const ralButton = event.target.closest("[data-ral]");
    const resetButton = event.target.closest("[data-reset]");
    const requestButton = event.target.closest("[data-request]");
    const copyButton = event.target.closest("[data-copy-request]");
    const nextButton = event.target.closest("[data-next-step]");
    const prevButton = event.target.closest("[data-prev-step]");
    const qtyPlus = event.target.closest("[data-qty-plus]");
    const qtyMinus = event.target.closest("[data-qty-minus]");

    if (tabButton) {
      setActiveSection(tabButton.dataset.sectionButton);
    }

    if (modelButton) {
      state.model = modelButton.dataset.model;
      root.querySelectorAll("[data-model]").forEach((button) => {
        button.classList.toggle("is-selected", button === modelButton);
      });
      render();
    }

    if (powerButton) {
      state.power = powerButton.dataset.power;
      root.querySelectorAll("[data-power]").forEach((button) => {
        button.classList.toggle("is-selected", button === powerButton);
      });
      render();
    }

    if (ralButton) {
      state.colorId = ralButton.dataset.ral;
      state.selected.add("body-color");
      render();
    }

    if (qtyPlus || qtyMinus) {
      event.preventDefault();
      const optionId = qtyPlus ? qtyPlus.dataset.qtyPlus : qtyMinus.dataset.qtyMinus;
      const option = options.find((item) => item.id === optionId);
      const current = getQuantity(option);
      const next = qtyPlus ? Math.min(option.max, current + 1) : Math.max(option.min, current - 1);
      state.quantities[optionId] = next;
      state.selected.add(optionId);
      renderOptions();
      renderSummary();
    }

    if (nextButton) {
      setActiveSection(steps[Math.min(steps.length - 1, state.step + 1)].id);
    }

    if (prevButton) {
      setActiveSection(steps[Math.max(0, state.step - 1)].id);
    }

    if (resetButton) {
      state.step = 0;
      state.model = "3";
      state.power = "dvs";
      state.colorId = "ral-9010";
      state.selected.clear();
      state.quantities = {};
      state.client = { name: "", phone: "", email: "", city: "", comment: "" };
      root.querySelectorAll("[data-client-field]").forEach((field) => {
        field.value = "";
      });
      root.querySelectorAll("[data-model]").forEach((button) => {
        button.classList.toggle("is-selected", button.dataset.model === "3");
      });
      root.querySelectorAll("[data-power]").forEach((button) => {
        button.classList.toggle("is-selected", button.dataset.power === "dvs");
      });
      render();
    }

    if (requestButton) {
      downloadCommercialOfferPdf();
    }

    if (copyButton) {
      copyApplicationText();
    }
  });

  root.addEventListener("change", (event) => {
    const checkbox = event.target.closest("[data-option-id]");
    const clientField = event.target.closest("[data-client-field]");

    if (clientField) {
      syncClientFields();
    }

    if (!checkbox) {
      return;
    }

    if (checkbox.checked) {
      const option = options.find((item) => item.id === checkbox.dataset.optionId);
      if (option && option.exclusive) {
        options
          .filter((item) => item.exclusive === option.exclusive && item.id !== option.id)
          .forEach((item) => state.selected.delete(item.id));
      }
      if (option && option.quantity && !state.quantities[option.id]) {
        state.quantities[option.id] = option.min || 1;
      }
      state.selected.add(checkbox.dataset.optionId);
    } else {
      state.selected.delete(checkbox.dataset.optionId);
    }

    renderOptions();
    renderSummary();
  });

  root.addEventListener("input", (event) => {
    if (event.target.closest("[data-client-field]")) {
      syncClientFields();
    }
  });

  render();
})();

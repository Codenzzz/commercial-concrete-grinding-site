const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const yearTarget = document.querySelector("[data-year]");
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");
const assistantLauncher = document.querySelector("[data-assistant-launcher]");
const assistantPanel = document.querySelector("[data-assistant-panel]");
const assistantClose = document.querySelector("[data-assistant-close]");
const assistantMessages = document.querySelector("[data-assistant-messages]");
const assistantActions = document.querySelector("[data-assistant-actions]");

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(contactForm);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const message = String(data.get("message") || "").trim();

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : "",
      "",
      message
    ]
      .filter(Boolean)
      .join("\n");

    const mailto = new URL("mailto:nick@commercialconcretegrinding.co.nz");
    mailto.searchParams.set("subject", `Marmoleum flooring enquiry from ${name || "website"}`);
    mailto.searchParams.set("body", body);

    window.location.href = mailto.toString();
    formStatus.textContent = "Your enquiry is ready to send.";
  });
}

const assistantQuestions = [
  {
    key: "flooringType",
    prompt: "What are you mainly looking for?",
    options: ["Marmoleum installation", "Commercial vinyl flooring", "Not sure yet"]
  },
  {
    key: "siteType",
    prompt: "What kind of commercial site is it?",
    options: ["School or education", "Healthcare or clinic", "Office or retail", "Hospitality or public space"]
  },
  {
    key: "area",
    prompt: "Roughly how big is the area or how many rooms?",
    inputLabel: "Example: 120m2 corridor and two classrooms"
  },
  {
    key: "stage",
    prompt: "Where is the project at?",
    options: ["Planning or specification", "Ready for site visit", "Urgent replacement", "Tender or pricing stage"]
  },
  {
    key: "details",
    prompt: "Any location, timing, subfloor or drawing details Nick should know?",
    inputLabel: "Example: Auckland CBD, school holiday install window, drawings available"
  }
];

const assistantState = {
  answers: {},
  step: 0
};

function appendAssistantMessage(text, type = "bot") {
  if (!assistantMessages) return;

  const message = document.createElement("div");
  message.className = `assistant-message ${type}`;
  message.textContent = text;
  assistantMessages.appendChild(message);
  assistantMessages.scrollTop = assistantMessages.scrollHeight;
}

function clearAssistantActions() {
  if (assistantActions) assistantActions.innerHTML = "";
}

function buildAssistantMailto() {
  const body = [
    "Marmoleum / commercial flooring enquiry",
    "",
    `Flooring type: ${assistantState.answers.flooringType || ""}`,
    `Site type: ${assistantState.answers.siteType || ""}`,
    `Area/rooms: ${assistantState.answers.area || ""}`,
    `Project stage: ${assistantState.answers.stage || ""}`,
    `Details: ${assistantState.answers.details || ""}`
  ].join("\n");

  const mailto = new URL("mailto:nick@commercialconcretegrinding.co.nz");
  mailto.searchParams.set("subject", "Marmoleum / commercial flooring enquiry");
  mailto.searchParams.set("body", body);
  return mailto.toString();
}

function renderAssistantSummary() {
  clearAssistantActions();
  appendAssistantMessage("I have enough to prepare an email for Nick.");

  const link = document.createElement("a");
  link.href = buildAssistantMailto();
  link.className = "assistant-primary";
  link.textContent = "Email this to Nick";
  assistantActions.appendChild(link);

  const restart = document.createElement("button");
  restart.type = "button";
  restart.textContent = "Start again";
  restart.addEventListener("click", startAssistant);
  assistantActions.appendChild(restart);
}

function renderAssistantStep() {
  clearAssistantActions();

  const question = assistantQuestions[assistantState.step];
  if (!question) {
    renderAssistantSummary();
    return;
  }

  appendAssistantMessage(question.prompt);

  if (question.options) {
    question.options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = option;
      button.addEventListener("click", () => {
        assistantState.answers[question.key] = option;
        appendAssistantMessage(option, "user");
        assistantState.step += 1;
        renderAssistantStep();
      });
      assistantActions.appendChild(button);
    });
    return;
  }

  const input = document.createElement("input");
  input.className = "assistant-input";
  input.placeholder = question.inputLabel;
  input.autocomplete = "off";
  assistantActions.appendChild(input);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "assistant-primary";
  button.textContent = "Next";
  button.addEventListener("click", () => {
    const value = input.value.trim();
    if (!value) {
      input.focus();
      return;
    }
    assistantState.answers[question.key] = value;
    appendAssistantMessage(value, "user");
    assistantState.step += 1;
    renderAssistantStep();
  });
  assistantActions.appendChild(button);
  input.focus();
}

function startAssistant() {
  if (!assistantMessages) return;
  assistantState.answers = {};
  assistantState.step = 0;
  assistantMessages.innerHTML = "";
  appendAssistantMessage("I can help turn your Marmoleum or commercial vinyl project into a clear enquiry.");
  renderAssistantStep();
}

function openAssistant() {
  if (!assistantPanel || !assistantLauncher) return;
  assistantPanel.hidden = false;
  assistantLauncher.setAttribute("aria-expanded", "true");
  if (!assistantMessages || assistantMessages.children.length === 0) {
    startAssistant();
  }
}

function closeAssistant() {
  if (!assistantPanel || !assistantLauncher) return;
  assistantPanel.hidden = true;
  assistantLauncher.setAttribute("aria-expanded", "false");
}

if (assistantLauncher && assistantPanel) {
  assistantLauncher.addEventListener("click", () => {
    if (assistantPanel.hidden) {
      openAssistant();
    } else {
      closeAssistant();
    }
  });
}

if (assistantClose) {
  assistantClose.addEventListener("click", closeAssistant);
}

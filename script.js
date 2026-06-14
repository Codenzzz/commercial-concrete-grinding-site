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
const betaCodeTarget = document.querySelector("[data-beta-code]");
const betaExpiryTarget = document.querySelector("[data-beta-expiry]");
const betaCopyButton = document.querySelector("[data-copy-beta-code]");
const betaCodeCard = document.querySelector("[data-beta-code-card]");

const betaCodeWindowDays = Number(betaCodeCard?.dataset.betaWindowDays || "7");
const betaCodeWindowMs = betaCodeWindowDays * 24 * 60 * 60 * 1000;
const betaCodeSalt = betaCodeCard?.dataset.betaSalt || "ccg-flooring-safety-pack-2026-public-beta";
const betaAppVersion = betaCodeCard?.dataset.betaVersion || "1.0.0";
const betaPackageId = betaCodeCard?.dataset.betaPackage || "nz.co.flooringsafetypack.app";
const betaCodePrefix = betaCodeCard?.dataset.betaPrefix || "FSP";

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

    const pageTopic = document.body.classList.contains("home-page")
      ? "Commercial concrete grinding enquiry"
      : "Marmoleum flooring enquiry";

    const mailto = new URL("mailto:nick@commercialconcretegrinding.co.nz");
    mailto.searchParams.set("subject", `${pageTopic} from ${name || "website"}`);
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
  const email = buildAssistantEmail();
  return email.mailto;
}

function betaHash(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function betaCodeForWindow(windowIndex) {
  const hash = betaHash(`${betaCodeSalt}:${betaPackageId}:${betaAppVersion}:${windowIndex}`);
  const digits = String(hash % 100000000).padStart(8, "0");
  return `${betaCodePrefix}-${digits.slice(0, 4)}-${digits.slice(4)}`;
}

function currentBetaCode() {
  return betaCodeForWindow(Math.floor(Date.now() / betaCodeWindowMs));
}

function renderBetaCode() {
  if (!betaCodeTarget) return;

  const now = Date.now();
  const windowIndex = Math.floor(now / betaCodeWindowMs);
  const expiresAt = new Date((windowIndex + 1) * betaCodeWindowMs);
  const code = currentBetaCode();
  betaCodeTarget.textContent = code;
  if (betaExpiryTarget) {
    betaExpiryTarget.textContent = `Use this code when the Android app opens. Valid until ${expiresAt.toLocaleString("en-NZ", {
      dateStyle: "medium",
      timeStyle: "short"
    })}.`;
  }
}

renderBetaCode();

if (betaCopyButton && betaCodeTarget) {
  betaCopyButton.addEventListener("click", async () => {
    const code = betaCodeTarget.textContent.trim();
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      betaCopyButton.textContent = "Copied";
      window.setTimeout(() => {
        betaCopyButton.textContent = "Copy beta code";
      }, 1800);
    } catch {
      betaCopyButton.textContent = code;
    }
  });
}

function buildAssistantEmail() {
  const body = [
    "Marmoleum / commercial flooring enquiry",
    "",
    `Flooring type: ${assistantState.answers.flooringType || ""}`,
    `Site type: ${assistantState.answers.siteType || ""}`,
    `Area/rooms: ${assistantState.answers.area || ""}`,
    `Project stage: ${assistantState.answers.stage || ""}`,
    `Details: ${assistantState.answers.details || ""}`
  ].join("\n");

  const subject = "Marmoleum / commercial flooring enquiry";
  const mailto = new URL("mailto:nick@commercialconcretegrinding.co.nz");
  mailto.searchParams.set("subject", subject);
  mailto.searchParams.set("body", body);
  return {
    body,
    mailto: mailto.toString(),
    subject
  };
}

async function copyAssistantEmail() {
  const email = buildAssistantEmail();
  const text = [
    "To: nick@commercialconcretegrinding.co.nz",
    `Subject: ${email.subject}`,
    "",
    email.body
  ].join("\n");

  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  return copied;
}

function renderAssistantSummary() {
  clearAssistantActions();
  appendAssistantMessage("I have enough to prepare an email for Nick.");

  const emailButton = document.createElement("button");
  emailButton.type = "button";
  emailButton.className = "assistant-primary";
  emailButton.textContent = "Email this to Nick";
  emailButton.addEventListener("click", async () => {
    try {
      await copyAssistantEmail();
      appendAssistantMessage(
        "If your email app does not open, the enquiry has been copied. Paste it into an email to nick@commercialconcretegrinding.co.nz."
      );
    } catch {
      appendAssistantMessage(
        "If your email app does not open, email Nick directly at nick@commercialconcretegrinding.co.nz."
      );
    }

    window.location.href = buildAssistantMailto();
  });
  assistantActions.appendChild(emailButton);

  const copy = document.createElement("button");
  copy.type = "button";
  copy.textContent = "Copy enquiry";
  copy.addEventListener("click", async () => {
    try {
      if (await copyAssistantEmail()) {
        appendAssistantMessage("Copied. Paste it into an email to nick@commercialconcretegrinding.co.nz.");
      } else {
        appendAssistantMessage("Copy did not work here. Email Nick directly at nick@commercialconcretegrinding.co.nz.");
      }
    } catch {
      appendAssistantMessage("Copy did not work here. Email Nick directly at nick@commercialconcretegrinding.co.nz.");
    }
  });
  assistantActions.appendChild(copy);

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

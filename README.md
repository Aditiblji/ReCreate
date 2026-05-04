# 🌱 ReCreate

**ReCreate** is an AI-powered sustainability web app that helps users turn everyday waste into something useful and creative. By simply uploading an image or entering a text prompt, users receive practical reuse ideas along with step-by-step instructions and an estimate of environmental impact.

🔗 Live App: https://re-create.netlify.app/

---

## 🚀 Features

* ♻️ **AI-Powered Reuse Ideas**
  Generate creative ways to reuse waste materials using AI.

* 🖼️ **Image-Based Recognition**
  Upload an image of waste material and let AI identify and suggest reuse ideas.

* ✍️ **Text Prompt Support**
  Enter descriptions manually to get tailored suggestions.

* 📋 **Step-by-Step Instructions**
  Each idea includes clear, actionable steps.

* 🌍 **Sustainability Impact Estimate**
  Understand how your action contributes to environmental sustainability.

* 📊 **Feedback System**
  User feedback is collected which could be stored and analysed for future improvements.

* ✏️**Detailed steps**
  **All options come with different level of difficulty and detailed steps. If available, youtube videos are also provided for the same.**

---

## 🖥️ Prototype images

# Home page:
<img width="782" height="747" alt="image" src="https://github.com/user-attachments/assets/c64b5bcf-e055-43f4-b4a9-aa3c706a1167" />

# Searched images:
<img width="1275" height="800" alt="image" src="https://github.com/user-attachments/assets/26bcf59d-556e-4ec1-9ee6-dca9753586c7" />

# Details and steps:
<img width="1026" height="837" alt="image" src="https://github.com/user-attachments/assets/860c3433-2189-49a3-a32c-96e3ca10003c" />

# Feedback:
<img width="958" height="205" alt="image" src="https://github.com/user-attachments/assets/d844cd5a-25d9-48d5-9b2b-b627f693709a" />


## 🧠 Tech Stack

* **Frontend:** React
* **Backend / Database:** Supabase
* **AI Integration:** Cerebras API
* **Hosting:** Netlify

---

## 🤖 AI Integration (Cerebras)

ReCreate leverages the **Cerebras API** for:

* Material recognition from images
* Generating creative reuse ideas
* Producing structured, step-by-step instructions

Cerebras enables:

* ⚡ Fast response times
* 🧩 High-quality, context-aware outputs
* 🎯 Improved accuracy in interpreting user inputs

This makes the app not just smart, but actually useful.

---

## 🧪 How It Works

1. Upload an image **or** enter a text prompt
2. AI analyzes the material or description
3. Generates reuse ideas
4. Displays:

   * Instructions
   * Sustainability impact
5. User can provide feedback to improve results

---

## 📁 Project Structure (High-Level)

```id="kq92ms"
src/
├── components/
├── pages/
├── services/
├── utils/
├── App.js
└── index.js
```

---

## ⚙️ Installation & Setup

```bash
git clone https://github.com/your-username/recreate.git
cd recreate
npm install
npm start
```

---

## 🔐 Environment Variables

Create a `.env` file and add:

```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_KEY=your_supabase_key
REACT_APP_CEREBRAS_API_KEY=your_cerebras_api_key
```

---

## 📈 Future Improvements

* More accurate material detection
* Expanded sustainability metrics
* Community sharing of reuse ideas
* Mobile app version

---

## 📌 Disclaimer

This project is intended for educational and sustainability awareness purposes. AI-generated suggestions may vary in practicality and should be evaluated before implementation.

---

## 💚 Inspiration

ReCreate was built to encourage small, everyday actions that collectively reduce waste and promote sustainable living.

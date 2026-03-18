# 🤲 Bharatanatyam Mudra Classifier 

<div align="center">

![Bharatanatyam Mudra Classifier](https://img.shields.io/badge/Deep%20Learning-EfficientNetB0-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi)
![PyTorch](https://img.shields.io/badge/PyTorch-EfficientNetB0-EE4C2C?style=for-the-badge&logo=pytorch)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**An AI-powered web application for real-time recognition of Bharatanatyam hand mudras using deep learning.**

*Achieving 99.71% accuracy on single-hand mudras and 99.89% on double-hand mudras.*

[📄 Research Paper](#-research-paper) • [🚀 Getting Started](#-getting-started) • [🧠 Model Architecture](#-model-architecture) • [📊 Results](#-results) • [👥 Team](#-team)

</div>

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Model Architecture](#-model-architecture)
- [Dataset](#-dataset)
- [Results](#-results)
- [Research Paper](#-research-paper)
- [Team](#-team)
- [Acknowledgements](#-acknowledgements)

---

## 🎯 About the Project

Bharatanatyam is one of India's oldest classical dance forms, using **mudras** (hand gestures) as a precise language to convey emotion, storytelling, and spiritual expression. Learning these mudras traditionally requires expert instructors and years of practice — making feedback slow and access limited.

This project bridges that gap with a **deep learning-based mudra recognition system** that can classify:

- **28 Single-hand mudras** (Asamyuta Hasta)
- **23 Double-hand mudras** (Samyukta Hasta)

The system uses a **dual-model architecture** with independent EfficientNetB0 classifiers for each mudra type, deployed via a FastAPI backend and a modern React + TypeScript frontend.

> This work was presented at the **5th International Conference on Sentiment Analysis and Deep Learning (ICSADL-2026)**, IEEE.

---

## ✨ Features

- 🖼️ **Real-time mudra classification** from uploaded images
- 🔀 **Dual-model pipeline** — separate models for single-hand and double-hand mudras
- 📚 **Mudra information pages** with meanings, usage, and cultural context
- 🎨 **Modern UI** built with React, Tailwind CSS, and shadcn/ui components
- ⚡ **Fast inference** with ONNX Runtime Web (browser-side) support
- 📱 **MediaPipe integration** for hand landmark detection
- 🌙 **Dark/Light theme** support via `next-themes`

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | Core UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS + shadcn/ui | Styling & UI components |
| Framer Motion | Animations |
| ONNX Runtime Web | Browser-side model inference |
| MediaPipe Tasks Vision | Hand landmark detection |
| React Router DOM | Client-side routing |
| TanStack Query | Server state management |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI (Python) | REST API server |
| PyTorch | Model training & inference |
| EfficientNetB0 | Feature extraction backbone |

---

## 📁 Project Structure

```
mudra-vision/
├── public/
│   └── team/                   # Team member photos
├── src/
│   ├── components/             # Reusable UI components
│   │   └── ui/                 # shadcn/ui component library
│   ├── pages/                  # Route-level page components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   └── main.tsx                # App entry point
├── backend/                    # FastAPI backend (separate repo / folder)
│   ├── single_hand_api.py      # Single-hand mudra classification service
│   ├── double_hand_api.py      # Double-hand mudra classification service
│   ├── models/
│   │   ├── single_hand_model.pth
│   │   └── double_hand_model.pth
│   └── requirements.txt
├── notebooks/
│   ├── one_hand.ipynb          # Training notebook — single-hand model
│   └── two_hand.ipynb          # Training notebook — double-hand model
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x and **npm** >= 9.x
- **Python** >= 3.9
- **pip**

---

### Frontend Setup

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/mudra-vision.git
cd mudra-vision

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The frontend will be available at **http://localhost:8080**

> The Vite dev server proxies `/api` and `/static/uploads` requests to `http://localhost:5000` (the FastAPI backend).

**Available scripts:**

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Production build |
| `npm run build:dev` | Development build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

### Backend Setup

```bash
# Navigate to the backend folder
cd backend

# Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the single-hand API
uvicorn single_hand_api:app --host 0.0.0.0 --port 5000 --reload

# (In a separate terminal) Start the double-hand API
uvicorn double_hand_api:app --host 0.0.0.0 --port 5001 --reload
```

---

## 🧠 Model Architecture

The system uses a **dual-model learning framework** — two independent EfficientNetB0 classifiers, one for each mudra category. This separation prevents inter-class confusion between single-hand and double-hand gestures and allows each model to specialize in task-specific feature sets.

```
Input Image (224×224×3)
        │
        ▼
┌───────────────────┐
│  User Selection   │  ← User explicitly selects: Single-Hand or Double-Hand
└───────────────────┘
        │
   ┌────┴────┐
   ▼         ▼
Single     Double
Hand       Hand
EfficientNetB0    EfficientNetB0
   │         │
   ▼         ▼
Global Average Pooling (GAP)
   │         │
   ▼         ▼
Fully Connected Layer + Softmax
   │         │
   ▼         ▼
28 classes  23 classes
```

### Key Design Choices

- **EfficientNetB0** — chosen for its compound scaling (depth × width × resolution) which maximizes accuracy per FLOP, making it ideal for real-time deployment.
- **Transfer Learning** — pretrained on ImageNet; classification head replaced with task-specific dense layers.
- **Global Average Pooling** — reduces spatial feature maps to compact vectors, lowering parameter count and overfitting risk.
- **Softmax output** — produces class probability distributions; highest probability → predicted mudra.

### Training Configuration

| Parameter | Value |
|---|---|
| Input resolution | 224 × 224 |
| Optimizer | Adam (lr = 1e-4) |
| Loss function | Categorical Cross-Entropy |
| Batch size | 32 |
| Epochs | 15 |
| Train / Val / Test split | 70% / 15% / 15% |
| Normalization | ImageNet mean & std |
| Data augmentation | Random flip, ±15° rotation, color jitter |
| Framework | PyTorch |

---

## 📦 Dataset

A custom dataset was self-collected for this project, recorded under controlled conditions with a plain background using a mobile camera. All gestures were performed by a certified Bharatanatyam dancer.

| Category | Classes | Images per Class | Total Images |
|---|---|---|---|
| Single-hand (Asamyuta Hasta) | 28 | 300 | 8,400 |
| Double-hand (Samyukta Hasta) | 23 | ~292 | ~6,700 |

**Dataset highlights:**
- Uniform class distribution
- Controlled lighting, plain background
- Manual annotation by domain experts
- Quality filtering: blurred, occluded, or incorrectly performed images removed

> 📂 Base dataset available at: [github.com/jisharajr/Bharatanatyam-Mudra-Dataset](https://github.com/jisharajr/Bharatanatyam-Mudra-Dataset)

---

## 📊 Results

### Performance Summary

| Task | Classes | Accuracy | Avg Precision | Avg Recall | Avg F1-Score |
|---|---|---|---|---|---|
| Single-Hand | 28 | **99.71%** | > 0.99 | > 0.99 | > 0.99 |
| Double-Hand | 23 | **99.89%** | > 0.99 | > 0.99 | > 0.99 |

### Comparison with Other Approaches

| Approach | Gesture Coverage | Accuracy | Key Limitations |
|---|---|---|---|
| Handcrafted features + ANN/CNN | Single-hand | 90–95% | Feature-dependent, limited generalization |
| MediaPipe + rule-based | Single-hand | 72% | Rule-based, low robustness |
| YOLOv3 CNN | Single-hand | mAP ≈ 73% | Detection-focused |
| YOLO + MediaPipe + MobileNet | Single + Double | High (reported) | Multi-stage pipeline, high complexity |
| Ontology-based retrieval | Limited mudras | F-score ≈ 0.85 | Not primarily recognition |
| **EfficientNetB0 Dual-Model (Ours)** | **Single + Double** | **99.71% / 99.89%** | Single performer, controlled background |

---

## 📄 Research Paper

This project was published at:

> **"EfficientNetB0-based Feature Extraction for Single and Double-Hand Mudra Recognition"**
> Prathviraj Chavan, Saniya Devarshi, Pooja Choudhary, Shubhi Upadhyay, Sumitra Sureliya, Awanit Kumar
> *Proceedings of the 5th International Conference on Sentiment Analysis and Deep Learning (ICSADL-2026)*
> ISBN: 979-8-3315-6882-5 | © 2026 IEEE

---

## 👥 Team

| Name | Role | Email | LinkedIn |
|---|---|---|---|
| **Prathviraj Chavan** | Developer & Researcher | mr.prathvirajchavan@gmail.com | [prathvirajchavan](https://www.linkedin.com/in/prathvirajchavan/) |
| **Pooja Choudhary** | Developer & Researcher | poojachoudhary1178@gmail.com | [pooja-choudhary1178](https://www.linkedin.com/in/pooja-choudhary1178/) |
| **Shubhi Upadhyay** | Developer & Researcher | shubhiupadhyay1516@gmail.com | [shubhii1516](https://www.linkedin.com/in/shubhii1516/) |
| **Saniya Devarshi** | Developer & Researcher | saniyadevarshi004@gmail.com | [saniya-devarshi0404](https://www.linkedin.com/in/saniya-devarshi04/) |
| **Sumitra Sureliya** | Teaching Assistant (Guide/Mentor) | sumitra121039@gmail.com | — |
| **Awanit Kumar** | Associate Professor (Guide) | itsawanitkumar@gmail.com | — |

All student researchers are from the **School of Computer Studies, Sri Balaji University, Pune, Maharashtra, India.**

---

## 🙏 Acknowledgements

- [EfficientNet (Google Brain)](https://arxiv.org/abs/1905.11946) for the backbone architecture
- [PyTorch](https://pytorch.org/) for the deep learning framework
- [FastAPI](https://fastapi.tiangolo.com/) for the backend API framework
- [shadcn/ui](https://ui.shadcn.com/) for the component library
- [MediaPipe](https://developers.google.com/mediapipe) for hand landmark detection
- [Lovable](https://lovable.dev/) for frontend development tooling
- The Bharatanatyam dancer who performed all mudras for the dataset

---

<div align="center">

Made with ❤️ at **Sri Balaji University, Pune**

*Preserving cultural heritage through technology*

</div>

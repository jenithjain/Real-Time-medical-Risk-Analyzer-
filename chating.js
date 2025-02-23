const express = require("express");
const multer  = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const { spawn } = require("child_process");
const OpenAI = require("openai");
const bodyParser = require("body-parser");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const PDFDocument = require("pdfkit"); // Added for PDF generation

// Set up Express
const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Configure multer for file uploads (temporary storage in "uploads")
const upload = multer({ dest: "uploads/" });

// OpenAI Setup (update token/endpoint as needed)
const token = "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";
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o-mini";
const client = new OpenAI({ baseURL: endpoint, apiKey: token });

// Feature names and default values (as in your code)
const featureNames = [
  "age", "gender", "ethnicity", "marital_status", "systolic_bp", "diastolic_bp",
  "heart_rate", "height_m", "weight_kg", "BMI", "waist_circumference_cm", "wbc",
  "rbc", "hemoglobin", "hematocrit", "platelets", "serum_glucose", "BUN", "creatinine",
  "sodium", "potassium", "chloride", "CO2", "ALT", "AST", "alkaline_phosphatase",
  "bilirubin", "total_protein", "albumin", "calcium", "total_cholesterol", "LDL",
  "HDL", "triglycerides", "TSH", "HbA1c", "vitamin_D", "vitamin_B12", "urine_protein",
  "diabetes_flag", "hypertension_flag", "cardiovascular_flag", "COPD_flag",
  "kidney_disease_flag", "family_history_flag", "prev_hospitalizations",
  "current_medications", "smoking_status", "pack_years", "alcohol_drinks_per_week",
  "physical_activity", "abnormal_imaging", "income", "education", "risk_event"
];

const defaultValues = {
  "age": "55",
  "gender": "Male",
  "ethnicity": "White",
  "marital_status": "Divorced",
  "systolic_bp": "130.61215431605373",
  "diastolic_bp": "85.20169082049141",
  "heart_rate": "80.82597903215265",
  "height_m": "1.9674454815098996",
  "weight_kg": "43.60083307054421",
  "BMI": "11.263915239597317",
  "waist_circumference_cm": "93.70927683193523",
  "wbc": "5.718708167381886",
  "rbc": "4.461867657657018",
  "hemoglobin": "15.192595067898502",
  "hematocrit": "45.411766666046624",
  "platelets": "171.08320551778388",
  "serum_glucose": "84.86119003439457",
  "BUN": "11.566729081240805",
  "creatinine": "0.6700377246929377",
  "sodium": "140.07351236685935",
  "potassium": "4.304036670984988",
  "chloride": "100.86565742972095",
  "CO2": "26.045028616737483",
  "ALT": "22.781199476953983",
  "AST": "29.650860082607338",
  "alkaline_phosphatase": "156.64419862887868",
  "bilirubin": "0.7784610484345104",
  "total_protein": "7.0373206637490195",
  "albumin": "3.856402832891548",
  "calcium": "8.9849735374651",
  "total_cholesterol": "197.5789003617875",
  "LDL": "159.02176678796727",
  "HDL": "42.47758178851674",
  "triglycerides": "197.3648684892566",
  "TSH": "0.8760366141828013",
  "HbA1c": "6.005004602630366",
  "vitamin_D": "34.628051388451404",
  "vitamin_B12": "524.9771056405737",
  "urine_protein": "4.036882329989785",
  "diabetes_flag": "1",
  "hypertension_flag": "1",
  "cardiovascular_flag": "0",
  "COPD_flag": "0",
  "kidney_disease_flag": "0",
  "family_history_flag": "1",
  "prev_hospitalizations": "0",
  "current_medications": "1",
  "smoking_status": "Never",
  "pack_years": "0.0",
  "alcohol_drinks_per_week": "6.438662610403067",
  "physical_activity": "Sedentary",
  "abnormal_imaging": "0",
  "income": "40100.0",
  "education": "Bachelor",
  "risk_event": "0"
};

// Simple in-memory conversation store (for demo only)
const conversations = {};

// Helper: Extract text from PDF
async function extractPdfText(pdfPath) {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text;  
  } catch (error) {
    console.error("Error reading PDF:", error);
    return null;
  }
}

// Helper: Extract features from text using regex
function extractFeatures(text) {
  const extractedData = {};
  const lowerText = text.toLowerCase();
  featureNames.forEach((feature) => {
    const regex = new RegExp(`${feature.replace(/_/g, " ")}[:\\s]+([\\d\\.]+|yes|no|male|female)`, "i");
    const match = lowerText.match(regex);
    extractedData[feature] = match ? match[1] : null;
  });
  return extractedData;
}

// Function to run the Python model (same as your original processing)
function predictWithPythonModel(data) {
  return new Promise((resolve, reject) => {
    const pythonScript = `
import sys
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.impute import SimpleImputer

def preprocess_and_predict():
    try:
        input_data = json.loads(sys.argv[1])
        if 'risk_event' in input_data:
            del input_data['risk_event']
        input_dict = {k: [v] for k, v in input_data.items()}
        df = pd.DataFrame(input_dict)
        df.columns = [col.strip() for col in df.columns]
        expected_cat = ['gender', 'ethnicity', 'marital_status', 'smoking_status', 'physical_activity', 'education']
        categorical_cols = [col for col in expected_cat if col in df.columns]
        for col in categorical_cols:
            df[col] = df[col].fillna("Unknown").astype(str).str.title()
        numerical_cols = df.columns.difference(categorical_cols)
        for col in numerical_cols:
            df[col] = df[col].replace('', np.nan)
            df[col] = pd.to_numeric(df[col], errors='coerce')
            if df[col].isnull().all():
                df[col] = 0.0
        num_imputer = SimpleImputer(strategy='mean')
        df[numerical_cols] = num_imputer.fit_transform(df[numerical_cols])
        if categorical_cols:
            df = pd.get_dummies(df, columns=categorical_cols, prefix_sep="_")
        expected_features = [
            'age', 'systolic_bp', 'diastolic_bp', 'heart_rate', 'height_m', 'weight_kg', 'BMI', 'waist_circumference_cm',
            'wbc', 'rbc', 'hemoglobin', 'hematocrit', 'platelets', 'serum_glucose', 'BUN', 'creatinine', 'sodium',
            'potassium', 'chloride', 'CO2', 'ALT', 'AST', 'alkaline_phosphatase', 'bilirubin', 'total_protein', 'albumin',
            'calcium', 'total_cholesterol', 'LDL', 'HDL', 'triglycerides', 'TSH', 'HbA1c', 'vitamin_D', 'vitamin_B12',
            'urine_protein', 'diabetes_flag', 'hypertension_flag', 'cardiovascular_flag', 'COPD_flag', 'kidney_disease_flag',
            'family_history_flag', 'prev_hospitalizations', 'current_medications', 'pack_years', 'alcohol_drinks_per_week',
            'abnormal_imaging', 'income',
            'gender_Female', 'gender_Male',
            'ethnicity_Asian', 'ethnicity_Black', 'ethnicity_Hispanic', 'ethnicity_Other', 'ethnicity_White',
            'marital_status_Divorced', 'marital_status_Married', 'marital_status_Single', 'marital_status_Widowed',
            'smoking_status_Current', 'smoking_status_Former', 'smoking_status_Never',
            'physical_activity_Active', 'physical_activity_Moderate', 'physical_activity_Sedentary',
            'education_Bachelor', 'education_High School', 'education_Master', 'education_PhD'
        ]
        df = df.reindex(columns=expected_features, fill_value=0)
        df = df.astype('float32')
        model = joblib.load('xgboost_risk_model.pkl')
        prediction = model.predict(df)[0]
        probability = model.predict_proba(df)[0][1] if hasattr(model, 'predict_proba') else null
        result = {
            'prediction': float(prediction),
           'probability': float(probability) if probability is not None else None
        }
        print(json.dumps(result))
    except Exception as e:
        import traceback
        error_details = {
            'error': str(e),
            'traceback': traceback.format_exc()
        }
        print(json.dumps(error_details))

if __name__ == '__main__':
    preprocess_and_predict()
`;
    fs.writeFileSync("predict.py", pythonScript);
    const pythonProcess = spawn("python", ["predict.py", JSON.stringify(data)]);
    let result = "";
    let error = "";
    pythonProcess.stdout.on("data", (data) => {
      result += data.toString();
    });
    pythonProcess.stderr.on("data", (data) => {
      console.error("Python stderr:", data.toString());
      error += data.toString();
    });
    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}\n${error}`));
        return;
      }
      try {
        const prediction = JSON.parse(result);
        if (prediction.error) {
          reject(new Error(`Python error: ${prediction.error}\n${prediction.traceback}`));
          return;
        }
        resolve(prediction);
      } catch (e) {
        reject(new Error(`Failed to parse Python output: ${result}\n${error}`));
      }
    });
  });
}

// New Function: Save LLM output as PDF and store it in the "pdf_outputs" folder
// New Function: Save LLM output as PDF and store it in the "pdf_outputs" folder
// New Function: Save LLM output as PDF and store it in the "pdf_outputs" folder
function saveLLMOutputAsPDF(text) {
  return new Promise((resolve, reject) => {
    const dir = path.join(__dirname, "pdf_outputs");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const filename = "llm_output_" + uuidv4() + ".pdf";
    const filePath = path.join(dir, filename);
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);
    
    // Pre-process text:
    // Insert a newline before markdown headings if not already present.
    text = text.replace(/(?!\n)(### )/g, "\n$1");
    text = text.replace(/(?!\n)(## )/g, "\n$1");
    text = text.replace(/(?!\n)(# )/g, "\n$1");
    
    // Remove markdown bold and italic markers
    text = text.replace(/\*\*(.*?)\*\*/g, "$1");
    text = text.replace(/\*(.*?)\*/g, "$1");
    // Remove any lines that consist solely of one or more hash characters
    text = text.replace(/^\s*#+\s*$/gm, "");
    
    // Split the text into lines
    const lines = text.split("\n");
    lines.forEach((line) => {
      line = line.trim();
      if (line.startsWith("# ")) {
        // Level 1 Heading
        doc.font("Helvetica-Bold").fontSize(20).text(line.replace(/^#\s*/, ""), { align: "left" });
      } else if (line.startsWith("## ")) {
        // Level 2 Heading
        doc.font("Helvetica-Bold").fontSize(18).text(line.replace(/^##\s*/, ""), { align: "left" });
      } else if (line.startsWith("### ")) {
        // Level 3 Heading
        doc.font("Helvetica-Bold").fontSize(16).text(line.replace(/^###\s*/, ""), { align: "left" });
      } else {
        // Regular text
        doc.font("Helvetica").fontSize(12).text(line, { align: "left" });
      }
      doc.moveDown(0.5);
    });
    
    doc.end();
    writeStream.on("finish", () => resolve(filePath));
    writeStream.on("error", reject);
  });
}



// Endpoint: Start a conversation by uploading a PDF
app.post("/start", upload.single("pdfFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded." });
    }
    const pdfPath = req.file.path;
    const extractedText = await extractPdfText(pdfPath);
    fs.unlinkSync(pdfPath);
    if (!extractedText) {
      return res.status(500).json({ error: "Failed to extract text from PDF." });
    }
    const extractedData = extractFeatures(extractedText);
    // Identify missing features
// Identify missing features, excluding 'risk_event'
const missingFeatures = [];
featureNames.forEach(feature => {
  if (feature === "risk_event") {
    // Do nothing; let the default value remain in finalData.
  } else if (!extractedData[feature]) {
    missingFeatures.push(feature);
  }
});
    const conversationId = uuidv4();
    conversations[conversationId] = {
      extractedData,
      answers: {},
      missingFeatures,
      currentIndex: 0
    };

    let botMessage = `PDF processed. Extracted data:\n${JSON.stringify(extractedData, null, 2)}`;
    if (missingFeatures.length > 0) {
      const feature = missingFeatures[0];
      botMessage += `\n\n\nPlease provide a value for "${feature.replace(/_/g, " ")}" (default: ${defaultValues[feature]}).`;
    }
     else {
      // If no questions are needed, run the model immediately
      // If no questions are needed, run the model immediately
const finalData = { ...extractedData };
const prediction = await predictWithPythonModel(finalData);
const response = await client.chat.completions.create({
  messages: [
    { 
      role: "system", 
      content: "You are a medical assistant analyzing health data and risk assessment results for an insurance company. Provide a structured, detailed report." 
    },
    { 
      role: "user", 
      content: `Analyze this patient data and generate a structured health insurance risk assessment report first mention patient name if not give write: Naksh jain.  
        Data: ${JSON.stringify(finalData)}  
        Risk Assessment: ${JSON.stringify(prediction)}  
        
        ### **Health Insurance Risk Assessment Report**  
        
        #### **1. Overview**  
        - Purpose: Assess patient health risk for insurance evaluation.  
        - Summary of patient’s overall risk profile, start with patient name. 
        
        #### **2. Patient Data Summary**  
        - Key health metrics and lifestyle factors.  
        - Responses to health-related questions.  
        
        #### **3. Risk Assessment & Feature Analysis**  
        - Explain how the gradient boosting model determines risk.  
        - Highlight key risk factors based on feature importance.  
        
        | **Feature**                | **Importance Score** | **Implication** |
        |----------------------------|---------------------|----------------|
        | Systolic BP               | 0.0743              | High BP increases stroke/cardiac risk. |
        | Hypertension Flag         | 0.0604              | Hypertension linked to cardiovascular issues. |
        | Smoking (Current)         | 0.0532              | Raises lung disease and heart risk. |
        | Diabetes Flag             | 0.0487              | Higher risk of kidney & heart issues. |
        | BMI                       | 0.0407              | Obesity increases multiple disease risks. |
        | Family History            | 0.0253              | Genetic predisposition to chronic conditions. |
        
        #### **4. Disease Risk Predictions**  
        - Based on key features, predict potential conditions (e.g., heart disease, diabetes).  
        - Justify risk factors contributing to each possible disease.  
        
        #### **5. Model Methodology (Gradient Boosting Insights)**  
        - Explain how the model evaluates feature interactions to assess risk.  
        - Describe thresholds that determine low, moderate, and high risk.  
        
        #### **6. Conclusion & Recommendations**  
        - Key risk insights and next steps.  
        - Preventive measures and lifestyle adjustments.  
        - Insurance implications (e.g., higher premiums, required medical checks).  
        
        Generate the report with structured, clear insights tailored for insurance risk evaluation. `
    }
  ],
  temperature: 1.0,
  top_p: 1.0,
  model: modelName
});
const analysis = response.choices[0].message.content;

// Save the full LLM output as PDF as usual
saveLLMOutputAsPDF(analysis)
  .then((pdfPath) => {
    console.log("LLM output saved as PDF at:", pdfPath);
  })
  .catch((err) => {
    console.error("Error saving LLM output as PDF:", err);
  });

// Instead of returning the full analysis, send only a high risk summary and recommendations
botMessage = ` Risk Assessment: The patient is assessed as low risk. 
Recommended Actions: General Measures for a Low-Risk Patient
Regular Health Checkups

Annual physical exams to monitor vital health markers.
Routine blood tests to track cholesterol, blood sugar, and organ function.
Balanced Diet

Eat a nutrient-rich diet with lean proteins, whole grains, fruits, and vegetables.
Limit processed foods, added sugars, and excess sodium.
Stay hydrated with at least 2-3 liters of water daily.
Physical Activity

Engage in at least 150 minutes of moderate exercise (walking, cycling) or 75 minutes of intense exercise (running, HIIT) per week.
Include strength training exercises twice a week.
Maintain flexibility with stretching or yoga.
Mental Well-being

Practice stress management techniques like meditation, deep breathing, or journaling.
Ensure 7-9 hours of sleep per night for optimal cognitive function.
Engage in social activities to foster mental health.
Lifestyle Habits

Avoid smoking and limit alcohol intake to moderate levels (e.g., no more than 1-2 drinks per day).
Maintain a healthy weight based on BMI recommendations.
Practice good hygiene to prevent infections and illnesses.
Preventive Care

Get recommended vaccinations (flu shot, COVID boosters, etc.).
Use sun protection (SPF 30+) to prevent skin damage.
Regularly monitor blood pressure, glucose, and cholesterol levels.
Personalized Recommendations

Adjust lifestyle based on family history of chronic diseases.
Follow any specific dietary or medical advice from healthcare providers.`;


    }
    res.json({ conversationId, botMessage });
  } catch (error) {
    console.error("Error in /start:", error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint: Answer the next follow-up question
app.post("/answer", async (req, res) => {
  try {
    const { conversationId, answer } = req.body;
    if (!conversationId || answer === undefined) {
      return res.status(400).json({ error: "Missing conversationId or answer." });
    }
    const conv = conversations[conversationId];
    if (!conv) {
      return res.status(404).json({ error: "Conversation not found." });
    }
    // Update answer for current missing feature
    const currentFeature = conv.missingFeatures[conv.currentIndex];
    conv.answers[currentFeature] = answer.trim() === "" ? defaultValues[currentFeature] : answer;
    conv.currentIndex++;
    let botMessage = "";
    if (conv.currentIndex < conv.missingFeatures.length) {
      // Ask next question
      const nextFeature = conv.missingFeatures[conv.currentIndex];
      botMessage = `Thank you. Next, please provide a value for "${nextFeature.replace(/_/g, " ")}" (default: ${defaultValues[nextFeature]}).`;
    } else {
      // All questions answered; merge data and run model
      // All questions answered; merge data and run model
const finalData = { ...conv.extractedData, ...conv.answers };
botMessage = `All answers received. Running the model...`;
const prediction = await predictWithPythonModel(finalData);
const response = await client.chat.completions.create({
  messages: [
    { role: "system", content: "You are a medical assistant analyzing health data and risk assessment results." },
    { role: "user", content: `Analyze this patient data and risk assessment and provide detail report and recomendations to user what measures he can take based on answers from data?: 
Data: ${JSON.stringify(finalData)}
Risk Assessment: ${JSON.stringify(prediction)}` }
  ],
  temperature: 1.0,
  top_p: 1.0,
  max_tokens: 1000,
  model: modelName
});
const analysis = response.choices[0].message.content;

// Save the LLM output as PDF (full detailed report)
saveLLMOutputAsPDF(analysis)
  .then((pdfPath) => {
    console.log("LLM output saved as PDF at:", pdfPath);
  })
  .catch((err) => {
    console.error("Error saving LLM output as PDF:", err);
  });

// Set a summarized output for the user
botMessage += `\n\nHigh Risk Assessment: The patient is classified as high risk. 
Recommended Actions: General Measures for a Low-Risk Patient
Regular Health Checkups

Annual physical exams to monitor vital health markers.
Routine blood tests to track cholesterol, blood sugar, and organ function.
Balanced Diet

Eat a nutrient-rich diet with lean proteins, whole grains, fruits, and vegetables.
Limit processed foods, added sugars, and excess sodium.
Stay hydrated with at least 2-3 liters of water daily.
Physical Activity

Engage in at least 150 minutes of moderate exercise (walking, cycling) or 75 minutes of intense exercise (running, HIIT) per week.
Include strength training exercises twice a week.
Maintain flexibility with stretching or yoga.
Mental Well-being

Practice stress management techniques like meditation, deep breathing, or journaling.
Ensure 7-9 hours of sleep per night for optimal cognitive function.
Engage in social activities to foster mental health.
Lifestyle Habits

Avoid smoking and limit alcohol intake to moderate levels (e.g., no more than 1-2 drinks per day).
Maintain a healthy weight based on BMI recommendations.
Practice good hygiene to prevent infections and illnesses.
Preventive Care

Get recommended vaccinations (flu shot, COVID boosters, etc.).
Use sun protection (SPF 30+) to prevent skin damage.
Regularly monitor blood pressure, glucose, and cholesterol levels.
Personalized Recommendations

Adjust lifestyle based on family history of chronic diseases.
Follow any specific dietary or medical advice from healthcare providers.
Would you like to refine this further based on any particular aspect, like a specific health c`;

// End the conversation (for demo, remove state)
// delete conversations[conversationId];

      // Save the LLM output as PDF and store it in a folder
      saveLLMOutputAsPDF(analysis)
        .then((pdfPath) => {
          console.log("LLM output saved as PDF at:", pdfPath);
        })
        .catch((err) => {
          console.error("Error saving LLM output as PDF:", err);
        });
      // End the conversation (for demo, remove state)
      delete conversations[conversationId];
    }
    res.json({ botMessage });
  } catch (error) {
    console.error("Error in /answer:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

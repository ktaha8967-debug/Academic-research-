import { UserDocument, DocumentSection } from "./types";

const DOCUMENTS_STORAGE_KEY = "academic_ai_user_documents_v1";

export const PRESET_RESEARCH_DOCUMENTS: UserDocument[] = [
  {
    id: "doc_attention_is_all_you_need",
    title: "Attention Is All You Need",
    fileName: "Attention_Is_All_You_Need_NeurIPS2017.pdf",
    fileSize: "2.1 MB",
    fileType: "pdf",
    uploadedAt: "2024-03-01T10:00:00.000Z",
    pageCount: 15,
    authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar", "Jakob Uszkoreit", "Llion Jones", "Aidan N. Gomez", "Lukasz Kaiser", "Illia Polosukhin"],
    abstract: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.",
    readingStatus: "starred",
    tags: ["Deep Learning", "Transformers", "NLP", "NeurIPS Landmark"],
    notes: "Foundational architecture for modern LLMs (GPT, Llama, Gemini, DeepSeek). Scaled dot-product attention + multi-head attention.",
    extractedKeyFindings: [
      "Replaced recurrent LSTM/GRU architectures with Multi-Head Self-Attention mechanisms.",
      "Achieved 28.4 BLEU on WMT 2014 English-to-German translation, establishing new state-of-the-art.",
      "Reduced training time to 3.5 days on 8 P100 GPUs via total parallelization.",
    ],
    extractedCitations: [
      "Bahdanau, D., Cho, K., & Bengio, Y. (2014). Neural machine translation by jointly learning to align and translate.",
      "Hochreiter, S., & Schmidhuber, J. (1997). Long short-term memory. Neural computation.",
    ],
    sections: [
      {
        id: "sec_1",
        title: "1. Introduction & Background",
        pageNumber: 1,
        content: "Recurrent neural networks, long short-term memory and gated recurrent neural networks in particular, have been firmly established as state of the art approaches in sequence modeling. However, sequential computation precludes parallelization within training examples. In this work we propose the Transformer, a model architecture eschewing recurrence and instead relying entirely on an attention mechanism to draw global dependencies between input and output.",
      },
      {
        id: "sec_2",
        title: "2. Model Architecture & Multi-Head Attention",
        pageNumber: 3,
        content: "The Transformer follows an encoder-decoder architecture using stacked self-attention and point-wise, fully connected layers for both the encoder and decoder. Multi-Head Attention allows the model to jointly attend to information from different representation subspaces at different positions: MultiHead(Q,K,V) = Concat(head_1, ..., head_h) W^O where head_i = Attention(Q W_i^Q, K W_i^K, V W_i^V).",
      },
      {
        id: "sec_3",
        title: "3. Training Regime & Results",
        pageNumber: 8,
        content: "On the WMT 2014 English-to-German translation task, the big transformer model (Transformer (big)) out-performed the best previously reported models (including ensembles) by more than 2.0 BLEU, establishing a new state-of-the-art BLEU score of 28.4. On the WMT 2014 English-to-French translation task, our model achieved a BLEU score of 41.0.",
      },
      {
        id: "sec_4",
        title: "4. Discussion & Conclusion",
        pageNumber: 11,
        content: "In this work, we presented the Transformer, the first sequence transduction model based entirely on attention, replacing the recurrent layers most commonly used in encoder-decoder architectures with multi-headed self-attention. We are excited about the future of attention-based models and plan to apply them to other domains.",
      },
    ],
    fullText: "Attention Is All You Need. Ashish Vaswani et al. Abstract: The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...",
  },
  {
    id: "doc_alphafold_nature_2021",
    title: "Highly Accurate Protein Structure Prediction with AlphaFold",
    fileName: "AlphaFold_Nature_2021.pdf",
    fileSize: "4.8 MB",
    fileType: "pdf",
    uploadedAt: "2024-02-15T14:30:00.000Z",
    pageCount: 22,
    authors: ["John Jumper", "Richard Evans", "Alexander Pritzel", "Tim Green", "Michael Figurnov", "Olaf Ronneberger", "Demis Hassabis"],
    abstract: "Proteins are essential to life, and understanding their structure can facilitate a mechanistic understanding of their function. Here we present AlphaFold, a computational method that can regularly predict protein structures with atomic accuracy - even in cases where no similar structure is known. This breakthrough fundamentally accelerates biological research across drug discovery, enzymology, and structural genomics.",
    readingStatus: "completed",
    tags: ["Biomedical", "Structural Biology", "AlphaFold", "Nature", "Protein Folding"],
    notes: "CASP14 champion architecture. Solved the 50-year-old protein folding problem using Evoformer representations and invariant point attention (IPA).",
    extractedKeyFindings: [
      "Achieved median GDT_TS score of 92.4 across all CASP14 blind evaluation targets.",
      "Atomic accuracy comparable to experimental X-ray crystallography and Cryo-EM.",
      "Introduced the Evoformer module to exchange information between MSA and spatial residue pairs.",
    ],
    extractedCitations: [
      "Senior, A. W. et al. Improved protein structure prediction using potentials from deep learning. Nature 577, 706-710 (2020).",
      "Kuhlman, B. & Bradley, P. Advances in protein structure prediction and design. Nat. Rev. Mol. Cell Biol. 20, 681-697 (2019).",
    ],
    sections: [
      {
        id: "sec_1",
        title: "1. Introduction & 50-Year Grand Challenge",
        pageNumber: 1,
        content: "Determining protein 3D structure from primary amino acid sequence has been a grand challenge in computational biology for over 50 years. AlphaFold demonstrates atomic accuracy across complex protein families.",
      },
      {
        id: "sec_2",
        title: "2. The Evoformer Architecture",
        pageNumber: 4,
        content: "The network directly reasons about spatial relationships and evolutionary history through the Evoformer block, passing information back and forth between multiple sequence alignments (MSAs) and pair representations.",
      },
      {
        id: "sec_3",
        title: "3. Validation on CASP14",
        pageNumber: 12,
        content: "AlphaFold predicted atomic positions with an average root-mean-square deviation (RMSD) of 0.96 Angstroms for the backbone atoms of CASP14 targets, matching experimental resolution standards.",
      },
    ],
    fullText: "Highly Accurate Protein Structure Prediction with AlphaFold. John Jumper, Demis Hassabis et al. Nature 2021...",
  },
  {
    id: "doc_crispr_cas9_science",
    title: "A Programmable Dual-RNA-Guided DNA Endonuclease in Adaptive Bacterial Immunity",
    fileName: "CRISPR_Cas9_Science_2012.pdf",
    fileSize: "1.8 MB",
    fileType: "pdf",
    uploadedAt: "2024-01-20T09:15:00.000Z",
    pageCount: 11,
    authors: ["Martin Jinek", "Krzysztof Chylinski", "Ines Fonfara", "Michael Hauer", "Jennifer A. Doudna", "Emmanuelle Charpentier"],
    abstract: "Clustered regularly interspaced short palindromic repeats (CRISPR)/CRISPR-associated (Cas) systems provide adaptive immunity against viruses and plasmids in bacteria. Here we show that the Cas9 endonuclease is guided by dual-RNA molecules to introduce double-stranded breaks in target DNA, providing a versatile, programmable platform for genome editing.",
    readingStatus: "completed",
    tags: ["Genetics", "CRISPR-Cas9", "Nobel Prize", "Science", "Gene Editing"],
    notes: "Nobel Prize in Chemistry 2020 landmark paper. Demonstrates single chimeric guide RNA (sgRNA) design for targeted genetic engineering.",
    extractedKeyFindings: [
      "Demonstrated Cas9 endonuclease cleaves double-stranded DNA at precise 20-nucleotide target sites.",
      "Engineered single guide RNA (sgRNA) by fusing crRNA and tracrRNA into a single synthetic transcript.",
      "Laid the technological foundation for modern therapeutics, agricultural genetics, and gene therapy.",
    ],
    extractedCitations: [
      "Bolotin, A. et al. (2005). Clustered regularly interspaced short palindrome repeats (CRISPR) have spacers of extrachromosomal origin.",
      "Mojica, F. J. et al. (2005). Intervening sequences of regularly spaced prokaryotic repeats derive from foreign genetic elements.",
    ],
    sections: [
      {
        id: "sec_1",
        title: "1. Abstract & Dual-RNA Cleavage Mechanism",
        pageNumber: 1,
        content: "Bacteria and archaea have evolved RNA-mediated adaptive defense systems called CRISPR/Cas. Cas9 requires both crRNA and trans-activating crRNA (tracrRNA) to activate blunt-ended double-strand DNA cleavage.",
      },
      {
        id: "sec_2",
        title: "2. Engineered Single-Guide RNA (sgRNA)",
        pageNumber: 5,
        content: "We designed a chimeric single-guide RNA that links the 3' end of crRNA to the 5' end of tracrRNA with a tetraloop. This two-component system allows sequence-specific cleavage of any DNA target containing a PAM sequence.",
      },
    ],
    fullText: "A Programmable Dual-RNA-Guided DNA Endonuclease in Adaptive Bacterial Immunity. Martin Jinek, Jennifer Doudna, Emmanuelle Charpentier...",
  },
  {
    id: "doc_deepseek_v3_technical_report",
    title: "DeepSeek-V3 Technical Report: Multi-Head Latent Attention & Mixture of Experts",
    fileName: "DeepSeek_V3_Technical_Report.pdf",
    fileSize: "3.4 MB",
    fileType: "pdf",
    uploadedAt: "2024-04-10T11:00:00.000Z",
    pageCount: 38,
    authors: ["DeepSeek-AI Team", "Aojun Liu", "Chao Dong", "Deyu Zhou", "Liang Zhao"],
    abstract: "We present DeepSeek-V3, a strong Mixture-of-Experts (MoE) language model with 671B total parameters with 37B activated for each token. DeepSeek-V3 introduces Multi-head Latent Attention (MLA) for efficient inference and auxiliary-loss-free strategy for load balancing, trained on 14.8T high-quality diverse tokens with unprecedented computational efficiency.",
    readingStatus: "starred",
    tags: ["DeepSeek", "LLMs", "Mixture-of-Experts", "Multi-Head Latent Attention", "Open Source AI"],
    notes: "Breakthrough open-weights architecture with state-of-the-art reasoning, competitive with closed frontier models at fraction of training cost.",
    extractedKeyFindings: [
      "671B MoE model with 37B active parameters per token, delivering frontier-grade throughput.",
      "Multi-Head Latent Attention (MLA) compresses KV cache drastically during inference.",
      "Auxiliary-loss-free load balancing eliminates performance degradation from auxiliary penalties.",
    ],
    extractedCitations: [
      "Vaswani, A. et al. (2017). Attention is all you need.",
      "Fedus, W. et al. (2022). Switch Transformers: Scaling to Trillion Parameter Models.",
    ],
    sections: [
      {
        id: "sec_1",
        title: "1. Architecture: Multi-Head Latent Attention",
        pageNumber: 2,
        content: "Standard Multi-Head Attention (MHA) creates large KV cache footprints during inference. DeepSeek-V3 introduces Multi-Head Latent Attention (MLA), which compresses Key-Value representations into a low-dimensional latent space.",
      },
      {
        id: "sec_2",
        title: "2. DeepSeekMoE with Auxiliary-Loss-Free Strategy",
        pageNumber: 8,
        content: "For the FFN architecture, DeepSeek-V3 adopts DeepSeekMoE, using fine-grained experts and isolating shared experts. To balance routing across experts without hurting performance, we dynamically adjust bias terms without auxiliary losses.",
      },
    ],
    fullText: "DeepSeek-V3 Technical Report. DeepSeek-AI. Abstract: We present DeepSeek-V3, a strong Mixture-of-Experts language model...",
  },
];

export function loadUserDocuments(): UserDocument[] {
  if (typeof window === "undefined") return PRESET_RESEARCH_DOCUMENTS;
  try {
    const raw = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
    if (!raw) {
      saveUserDocuments(PRESET_RESEARCH_DOCUMENTS);
      return PRESET_RESEARCH_DOCUMENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : PRESET_RESEARCH_DOCUMENTS;
  } catch (err) {
    console.error("Error loading user documents:", err);
    return PRESET_RESEARCH_DOCUMENTS;
  }
}

export function saveUserDocuments(documents: UserDocument[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(documents));
  } catch (err) {
    console.error("Error saving user documents:", err);
  }
}

export function addUserDocument(doc: Partial<UserDocument> & { title: string; fileName: string; fullText: string }): UserDocument {
  const current = loadUserDocuments();
  const id = `doc_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
  
  // Basic section splitter if not provided
  let sections: DocumentSection[] = doc.sections || [];
  if (sections.length === 0) {
    const paragraphs = doc.fullText.split(/\n\s*\n/).filter((p) => p.trim().length > 30);
    sections = paragraphs.slice(0, 6).map((p, idx) => ({
      id: `sec_${idx + 1}`,
      title: idx === 0 ? "1. Abstract & Introduction" : idx === 1 ? "2. Methodology" : idx === 2 ? "3. Empirical Results" : `Section ${idx + 1}`,
      content: p.trim(),
      pageNumber: Math.floor(idx / 2) + 1,
    }));
  }

  const newDoc: UserDocument = {
    id,
    title: doc.title,
    fileName: doc.fileName,
    fileSize: doc.fileSize || "1.2 MB",
    fileType: doc.fileType || "pdf",
    uploadedAt: new Date().toISOString(),
    pageCount: doc.pageCount || Math.ceil(doc.fullText.length / 2500) || 4,
    authors: doc.authors || ["Research Scholar"],
    abstract: doc.abstract || (doc.fullText.slice(0, 320) + "..."),
    sections,
    fullText: doc.fullText,
    readingStatus: doc.readingStatus || "to_read",
    tags: doc.tags || ["Uploaded Research", "My Library"],
    notes: doc.notes || "",
    extractedKeyFindings: doc.extractedKeyFindings || [
      "Document ingested into local research workspace.",
      "Available for multi-agent synthesis, literature matrix, and conversational Q&A.",
    ],
    extractedCitations: doc.extractedCitations || [],
    pdfDataUrl: doc.pdfDataUrl,
  };

  const updated = [newDoc, ...current];
  saveUserDocuments(updated);
  return newDoc;
}

export function updateUserDocument(id: string, updates: Partial<UserDocument>): UserDocument[] {
  const current = loadUserDocuments();
  const updated = current.map((d) => (d.id === id ? { ...d, ...updates } : d));
  saveUserDocuments(updated);
  return updated;
}

export function deleteUserDocument(id: string): UserDocument[] {
  const current = loadUserDocuments();
  const updated = current.filter((d) => d.id !== id);
  saveUserDocuments(updated);
  return updated;
}

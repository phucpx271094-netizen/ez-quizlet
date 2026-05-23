import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  Award, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Layers, 
  Sparkles, 
  Info, 
  HelpCircle, 
  Check, 
  ChevronRight, 
  TrendingUp, 
  Users, 
  GraduationCap,
  Keyboard
} from "lucide-react";

// DỮ LIỆU SỬ DỤNG TRONG ỨNG DỤNG

interface Flashcard {
  id: number;
  front: string;
  back: string;
  category: "Tổng quan" | "Rủi ro" | "Mô hình" | "Kỹ thuật" | "Đo lường";
}

const FLASHCARDS_DATA: Flashcard[] = [
  {
    id: 1,
    front: "Early Prediction",
    back: "Hệ thống nhận diện rủi ro học tập ngay khi nhập học, dùng dữ liệu đầu vào để lên phương án hỗ trợ kịp thời.",
    category: "Tổng quan"
  },
  {
    id: 2,
    front: "3 Risk Categories",
    back: "Phân loại sinh viên thành 3 nhóm rủi ro: Success (Thành công - 56%), Relative Success (Thành công tương đối - 16%), và Failure (Thất bại - 28%).",
    category: "Rủi ro"
  },
  {
    id: 3,
    front: "Class Imbalance",
    back: "Hiện tượng mất cân bằng mẫu, nhóm 'Thành công' áp đảo về số lượng, khiến mô hình AI bị thiên lệch và bỏ qua nhóm rủi ro thiểu số.",
    category: "Rủi ro"
  },
  {
    id: 4,
    front: "SMOTE",
    back: "Kỹ thuật sinh thêm các điểm dữ liệu nhân tạo cho nhóm thiểu số nhằm cân bằng tập dữ liệu huấn luyện.",
    category: "Kỹ thuật"
  },
  {
    id: 5,
    front: "ADASYN",
    back: "Biến thể sinh dữ liệu tương tự SMOTE nhưng tập trung tự động vào các vùng ranh giới phân lớp khó dự đoán.",
    category: "Kỹ thuật"
  },
  {
    id: 6,
    front: "F1-Score",
    back: "Thang đo trung bình điều hòa giữa Precision và Recall, phản ánh đúng hiệu năng dự đoán hơn Accuracy đối với tập dữ liệu mất cân bằng.",
    category: "Đo lường"
  },
  {
    id: 7,
    front: "Pre-enrollment Data",
    back: "Gồm 25 biến số thu thập trước khi sinh viên nhập học (nhân khẩu học, kinh tế, kết quả học bạ cấp 3); tuyệt đối không sử dụng điểm đại học.",
    category: "Tổng quan"
  },
  {
    id: 8,
    front: "Standard Machine Learning",
    back: "Nhóm thuật toán học máy truyền thống làm nền tảng đối chiếu (Logistic Regression, Decision Tree, SVM, Random Forest).",
    category: "Mô hình"
  },
  {
    id: 9,
    front: "Boosting Algorithms",
    back: "Thuật toán học máy huấn luyện nối tiếp kết hợp tuần tự các mô hình yếu thành mô hình mạnh. Tối ưu tốt cho phân loại đa lớp mất cân bằng.",
    category: "Mô hình"
  },
  {
    id: 10,
    front: "XGBoost",
    back: "Thuật toán tăng cường gradient cực đại (Extreme Gradient Boosting), đem lại hiệu năng phân loại rủi ro xuất sắc nhất trong nghiên cứu thực nghiệm.",
    category: "Mô hình"
  }
];

interface QuizQuestion {
  id: number;
  question: string;
  options: { key: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "Dữ liệu thu thập phục vụ cho mô hình dự đoán sớm được lấy từ thời điểm nào?",
    options: [
      { key: "A", text: "Sau khi sinh viên hoàn thành năm học thứ nhất" },
      { key: "B", text: "Có sẵn ngay tại thời điểm sinh viên ghi danh nhập học" },
      { key: "C", text: "Ngay trước khi sinh viên xét tốt nghiệp ra trường" },
      { key: "D", text: "Khi sinh viên bắt đầu có kết quả học tập kém" }
    ],
    correctAnswer: "B",
    explanation: "Mô hình sử dụng dữ liệu nhập học (Pre-enrollment data) như nhân khẩu học, điều kiện kinh tế, điểm học bạ THPT để dự đoán rủi ro ngay từ đầu."
  },
  {
    id: 2,
    question: "Nhóm sinh viên thuộc phân lớp \"Thành công tương đối\" (Relative Success) được định nghĩa là gì?",
    options: [
      { key: "A", text: "Sinh viên hoàn thành chương trình học và nhận bằng đúng thời hạn quy định" },
      { key: "B", text: "Sinh viên hoàn thành chương trình muộn, mất thêm tối đa 3 năm để nhận bằng" },
      { key: "C", text: "Sinh viên tự ý bỏ học hoặc bị đình chỉ học tập trước khi hoàn thành chương trình" },
      { key: "D", text: "Sinh viên phải học lại và thi lại ít nhất 3 môn học phần chuyên ngành" }
    ],
    correctAnswer: "B",
    explanation: "Nghiên cứu phân loại chi tiết: Success là đúng hạn, Relative Success là muộn tối đa 3 năm, còn Failure là bỏ học hoặc không thể tốt nghiệp."
  },
  {
    id: 3,
    question: "Nhóm \"Thành công\" chiếm tới 56% tổng dữ liệu gây ra khó khăn gì cho thuật toán Machine Learning?",
    options: [
      { key: "A", text: "Làm tiêu tốn quá nhiều bộ nhớ và tài nguyên lưu trữ của máy chủ" },
      { key: "B", text: "Khiến thuật toán chạy chậm và mất nhiều thời gian huấn luyện hơn" },
      { key: "C", text: "Gấy mất cân bằng lớp (Class Imbalance), tạo thiên lệch cao khiến AI khó nhận diện nhóm rủi ro thiểu số" },
      { key: "D", text: "Gây lỗi hệ thống xử lý ma trận và không thể hội tụ thuật toán" }
    ],
    correctAnswer: "C",
    explanation: "Khi một lớp chiếm đa số quá lớn (56%), mô hình có xu hướng đoán mò vào lớp đó để đạt độ chính xác (Accuracy) cao nhưng sẽ bỏ sót hoàn toàn các nhóm đặc thù cần hỗ trợ."
  },
  {
    id: 4,
    question: "Thuật toán tạo mẫu dữ liệu tổng hợp nào mang lại chỉ số F1-score tổng thể cao nhất trong nghiên cứu?",
    options: [
      { key: "A", text: "ADASYN (Adaptive Synthetic Sampling)" },
      { key: "B", text: "SMOTE (Synthetic Minority Over-sampling Technique)" },
      { key: "C", text: "Random Forest (Rừng ngẫu nhiên)" },
      { key: "D", text: "K-Means Clustering" }
    ],
    correctAnswer: "B",
    explanation: "Mặc dù ADASYN cải tiến tinh vi, kết quả thực nghiệm chỉ ra phương pháp SMOTE vẫn mang lại chỉ số F1-score cân bằng và tối ưu nhất cho bài toán này."
  },
  {
    id: 5,
    question: "Tại sao nghiên cứu ưu tiên tối ưu hóa chỉ số F1-score thay vì chỉ số Accuracy thông thường?",
    options: [
      { key: "A", text: "Vì chỉ số F1-score dễ tính toán hơn rất nhiều so với Accuracy" },
      { key: "B", text: "Vì Accuracy không phản ánh chính xác hiệu năng thực tế trên tập dữ liệu bị mất cân bằng" },
      { key: "C", text: "Vì điểm F1-score trên lý thuyết luôn luôn đạt kết quả cao hơn điểm Accuracy" },
      { key: "D", text: "Vì F1-score giúp các thuật toán huấn luyện chạy nhanh hơn 2 lần" }
    ],
    correctAnswer: "B",
    explanation: "Với dữ liệu mất cân bằng, một mô hình 'lười biếng' đoán tất cả là 'Thành công' vẫn đạt 56% Accuracy nhưng F1-score của các nhóm nguy cơ sẽ bằng 0. Do đó F1-score trung thực hơn."
  },
  {
    id: 6,
    question: "Trong số các mô hình học máy tiêu chuẩn (Standard ML), mô hình nào ghi nhận hiệu năng phân loại kém nhất?",
    options: [
      { key: "A", text: "Support Vector Machine (SVM)" },
      { key: "B", text: "Random Forest" },
      { key: "C", text: "Logistic Regression" },
      { key: "D", text: "Decision Tree" }
    ],
    correctAnswer: "A",
    explanation: "SVM gặp khó khăn lớn trong việc thiết lập mảng ranh giới phân tách tối ưu khi đối mặt với dữ liệu đa biến phi tuyến tính phức tạp có tỷ lệ mất cân bằng cao."
  },
  {
    id: 7,
    question: "Thuật toán học máy nào xuất sắc đạt hiệu năng cao nhất trên toàn bộ các phép thử nghiệm?",
    options: [
      { key: "A", text: "Random Forest" },
      { key: "B", text: "Gradient Boosting" },
      { key: "C", text: "Extreme Gradient Boosting (XGBoost)" },
      { key: "D", text: "Logistic Regression" }
    ],
    correctAnswer: "C",
    explanation: "XGBoost chứng minh ưu thế tuyệt đối nhờ tốc độ xử lý nhanh, khả năng xử lý tốt mối quan hệ phi tuyến, kiểm soát overfitting xuất sắc và hỗ trợ phân loại đa lớp tự động."
  },
  {
    id: 8,
    question: "Nguyên lý hoạt động cốt lõi của Nhóm thuật toán tăng cường (Boosting) là gì?",
    options: [
      { key: "A", text: "Loại bỏ hoàn toàn các nhiễu dữ liệu và lọc bỏ các bản ghi không hợp chuẩn" },
      { key: "B", text: "Sử dụng một mô hình duy nhất có kích thước khổng lồ để tính toán song song" },
      { key: "C", text: "Huấn luyện tuần tự các mô hình yếu, mô hình sau tập trung tối ưu sửa lỗi cho mô hình trước đó" },
      { key: "D", text: "Chuyển đổi toàn bộ các biến số văn bản thô thành biểu diễn vector số học" }
    ],
    correctAnswer: "C",
    explanation: "Boosting là mô hình học kết hợp (Ensemble Method) xây dựng chuỗi các bộ phân lớp yếu nối tiếp nhau, mẫu học sai ở mô hình trước sẽ được tăng trọng số ở mô hình sau hành trình."
  },
  {
    id: 9,
    question: "Phân nhóm rủi ro nào khiến các mô hình trí tuệ nhân tạo (AI) khó dự đoán chính xác nhất?",
    options: [
      { key: "A", text: "Nhóm Thành công (Success)" },
      { key: "B", text: "Nhóm Thành công tương đối (Relative Success)" },
      { key: "C", text: "Nhóm Thất bại (Failure)" },
      { key: "D", text: "Cả ba nhóm đều có độ khó dự đoán hoàn toàn như nhau" }
    ],
    correctAnswer: "B",
    explanation: "Nhóm Thành công tương đối chỉ chiếm tỷ trọng siêu nhỏ (16%), đồng thời ranh giới đặc trưng hành vi rất nhạt nhòa, dễ lẫn lộn giữa thành công xuất sắc và dừng bước."
  },
  {
    id: 10,
    question: "Theo nghiên cứu, hướng đi tiềm năng để nâng cấp độ chính xác của mô hình trong tương lai là gì?",
    options: [
      { key: "A", text: "Bổ sung thêm kết quả học tập thực tế và điểm số tích lũy ở những học kỳ đầu tiên" },
      { key: "B", text: "Sử dụng hình ảnh chân dung kỹ thuật số của sinh viên để nhận diện cảm xúc" },
      { key: "C", text: "Bỏ qua hoàn toàn nhóm thất bại ra khỏi danh sách huấn luyện thuật toán" },
      { key: "D", text: "Thay đổi hoàn toàn sang bộ dữ liệu của một trường đại học nước ngoài khác" }
    ],
    correctAnswer: "A",
    explanation: "Sự kết hợp giữa Pre-enrollment data cố định ban đầu và 'In-progress data' (điểm tổng kết kỳ 1-2 năm nhất) sẽ giúp tạo nên chuỗi kiểm soát rủi ro học đường năng động và chính xác gấp bội."
  }
];

export default function App() {
  // Navigation / Custom Paths Router
  const [currentPath, setCurrentPath] = useState<"/flashcard" | "/multiple-choice">(() => {
    const path = window.location.pathname;
    if (path === "/multiple-choice") return "/multiple-choice";
    return "/flashcard";
  });

  useEffect(() => {
    // Synchronize initial route to render
    if (window.location.pathname !== currentPath) {
      window.history.replaceState({}, "", currentPath);
    }

    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === "/multiple-choice") {
        setCurrentPath("/multiple-choice");
      } else {
        setCurrentPath("/flashcard");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [currentPath]);

  const navigateTo = (path: "/flashcard" | "/multiple-choice") => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
  };

  // Flashcards State
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [showIncompleteAlert, setShowIncompleteAlert] = useState(false);

  // Trích xuất thống kê từ dữ liệu flashcard
  const totalCards = FLASHCARDS_DATA.length;
  const currentCard = FLASHCARDS_DATA[currentCardIndex];

  // Keyboard Shortcuts for Flashcards
  useEffect(() => {
    if (currentPath !== "/flashcard") return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.code === "ArrowRight") {
        handleNextCard();
      } else if (e.code === "ArrowLeft") {
        handlePrevCard();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentPath, currentCardIndex]);

  // Điều hướng Flashcards
  const handleNextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev === totalCards - 1 ? 0 : prev + 1));
    }, 150);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev === 0 ? totalCards - 1 : prev - 1));
    }, 150);
  };

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  const handleSelectOption = (questionId: number, optionKey: string) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionKey
    }));
    setShowIncompleteAlert(false);
  };

  const handleSubmitQuiz = () => {
    // Kiểm tra đã làm hết câu hỏi chưa
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < QUIZ_DATA.length) {
      setShowIncompleteAlert(true);
      // Tự động cuộn đến câu đầu tiên chưa làm
      const firstUnanswered = QUIZ_DATA.find(q => !selectedAnswers[q.id]);
      if (firstUnanswered) {
        document.getElementById(`question-${firstUnanswered.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Tính điểm
    let correctCount = 0;
    QUIZ_DATA.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    setQuizScore(correctCount);
    setIsSubmitted(true);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setQuizScore(0);
    setShowIncompleteAlert(false);
    // Cuộn lên câu hỏi đầu tiên
    document.getElementById("quiz-top")?.scrollIntoView({ behavior: "smooth" });
  };

  // Xác định hiệu ứng màu sắc tương ứng chuyên mục của Flashcard
  const getCategoryTheme = (category: string) => {
    switch(category) {
      case "Tổng quan": return "bg-blue-950/50 text-blue-300 border-blue-800/40";
      case "Rủi ro": return "bg-rose-950/50 text-rose-300 border-rose-800/40";
      case "Mô hình": return "bg-cyan-950/50 text-cyan-300 border-cyan-800/40";
      case "Kỹ thuật": return "bg-amber-950/50 text-amber-300 border-amber-800/40";
      case "Đo lường": return "bg-teal-950/50 text-teal-300 border-teal-800/40";
      default: return "bg-slate-800/50 text-slate-300 border-slate-750";
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans selection:bg-cyan-500/20 selection:text-cyan-300 antialiased" id="app-root">
      
      {/* HEADER SECTION WITH DARK GLASS MORPHISM */}
      <header className="border-b border-white/10 bg-slate-900/60 backdrop-blur-md shadow-lg sticky top-0 z-50 py-3 sm:py-4" id="main-header">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 bg-cyan-500 text-slate-950 rounded-xl shadow-md shadow-cyan-500/20 self-center">
              <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/25">
                  Dự án ML Edu
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-medium">v1.2.0</span>
              </div>
              <h1 className="text-lg sm:text-xl font-display font-bold text-white tracking-tight leading-tight">
                Dự Đoán Sớm Kết Quả Học Tập
              </h1>
            </div>
          </div>
          
          {/* Dashboard Quick Stats matching dark theme */}
          <div className="hidden md:flex items-center gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-2 bg-slate-800/55 px-3 py-1.5 rounded-lg border border-white/5">
              <Users className="h-4 w-4 text-cyan-400" />
              <span><strong className="text-white">25</strong> Biến số tuyển sinh</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/55 px-3 py-1.5 rounded-lg border border-white/5">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              <span>Mô hình đỉnh cao: <strong className="text-cyan-400">XGBoost</strong></span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Intro Banner with immersive stars background and cyan radial glow */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white py-10 px-4 text-center relative overflow-hidden border-b border-white/10" id="hero-banner">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent opacity-60"></div>
        <div className="max-w-4xl mx-auto relative z-10 space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold tracking-tight text-cyan-450 leading-normal">
            Công Cụ Học Tập Tương Tác AI
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed opacity-90">
            Học tập chủ động các thuật ngữ nghiên cứu và kiểm thử nhanh kiến thức khoa học dữ liệu về hệ thống nhận diện rủi ro học tập trực tiếp từ dữ liệu tuyển sinh ban đầu.
          </p>
          
          {/* Mini Visual Badge Matrix */}
          <div className="pt-2 flex flex-wrap justify-center gap-2 sm:gap-3 text-xs">
            <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 px-3 py-1 rounded-full font-medium">
              Success (56%)
            </span>
            <span className="bg-cyan-500/15 text-cyan-300 border border-cyan-500/20 px-3 py-1 rounded-full font-medium">
              Relative Success (16%)
            </span>
            <span className="bg-rose-500/15 text-rose-300 border border-rose-500/20 px-3 py-1 rounded-full font-medium">
              Failure (28%)
            </span>
          </div>
        </div>
      </section>

      {/* MAIN LAYOUT */}
      <main className="max-w-6xl mx-auto px-4 py-8" id="main-content">
        
        {/* TABS CONTROLLERS */}
        <div className="flex justify-center mb-8" id="tabs-container">
          <div className="bg-slate-900/60 p-1 rounded-2xl border border-white/10 shadow-xl flex gap-1 w-full max-w-md backdrop-blur-xs">
            <button
              id="tab-btn-flashcard"
              onClick={() => navigateTo("/flashcard")}
              className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-medium transition-all duration-200 text-sm cursor-pointer ${
                currentPath === "/flashcard"
                  ? "bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent"
              }`}
            >
              <Layers className="h-4 relative z-10" />
              <span>Flashcard</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                currentPath === "/flashcard" ? "bg-cyan-500/25 text-cyan-200" : "bg-white/10 text-slate-400"
              }`}>10 Thẻ</span>
            </button>
            <button
              id="tab-btn-quiz"
              onClick={() => navigateTo("/multiple-choice")}
              className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-medium transition-all duration-200 text-sm cursor-pointer ${
                currentPath === "/multiple-choice"
                  ? "bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent"
              }`}
            >
              <Award className="h-4 relative z-10" />
              <span>Trắc Nghiệm</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                currentPath === "/multiple-choice" ? "bg-cyan-500/25 text-cyan-200" : "bg-white/10 text-slate-400"
              }`}>10 Câu</span>
            </button>
          </div>
        </div>

        {/* TAB CONTENT: FLASHCARD */}
        {currentPath === "/flashcard" && (
          <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]" id="flashcard-tab-view">
            
            {/* Control Info bar */}
            <div className="max-w-xl mx-auto flex items-center justify-between text-slate-400 text-xs px-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded border ${getCategoryTheme(currentCard.category)} font-mono font-medium text-[10px]`}>
                  {currentCard.category}
                </span>
                <span>Thẻ {currentCardIndex + 1} trên {totalCards}</span>
              </div>
              <button 
                onClick={() => setShowShortcutsHelp(prev => !prev)}
                className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                title="Xem phím tắt bàn phím"
              >
                <Keyboard className="h-4 w-4" />
                <span className="hidden sm:inline">Phím tắt</span>
              </button>
            </div>

            {/* Keyboard Shortcuts Tooltip */}
            {showShortcutsHelp && (
              <div className="max-w-xl mx-auto bg-slate-950 text-slate-200 p-3 rounded-xl border border-white/10 text-xs flex justify-around gap-4 animate-[slideDown_0.2s_ease-out]">
                <div><kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white shadow-xs mr-1.5 font-mono border border-white/5">Space</kbd> Lật mặt thẻ</div>
                <div><kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white shadow-xs mr-1.5 font-mono border border-white/5">←</kbd> Quay lại</div>
                <div><kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white shadow-xs mr-1.5 font-mono border border-white/5">→</kbd> Tiếp theo</div>
              </div>
            )}

            {/* 3D Interactive Flip Card Stage with Immersive styling */}
            <div className="flex justify-center items-center py-4">
              <div 
                id={`flashcard-item-${currentCard.id}`}
                className="w-full max-w-xl h-80 sm:h-96 perspective-1000 cursor-pointer group"
                onClick={() => setIsFlipped(prev => !prev)}
              >
                <div className={`relative w-full h-full duration-550 transform-style-3d transition-transform ${
                  isFlipped ? "rotate-y-180" : ""
                }`}>
                  
                  {/* FRONT SIDE */}
                  <div className="absolute inset-0 w-full h-full rounded-3xl bg-slate-850 border border-white/10 p-6 sm:p-8 shadow-2xl hover:border-cyan-500/30 hover:shadow-cyan-500/5 transition-all flex flex-col justify-between backface-hidden select-none">
                    
                    {/* Upper decorative elements */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 bg-cyan-400 rounded-full animate-pulse"></span>
                        <span className="text-xs font-mono tracking-wider text-cyan-400 font-semibold uppercase">Mặt trước • Keywords</span>
                      </div>
                      <button 
                        onClick={(e) => toggleFavorite(currentCard.id, e)}
                        className={`p-1.5 rounded-full transition-colors border ${
                          favorites.includes(currentCard.id) 
                            ? "bg-amber-500/20 text-amber-400 border-amber-500/30 self-center" 
                            : "bg-white/5 text-slate-400 border-transparent hover:bg-white/10 self-center"
                        }`}
                        title="Đánh dấu thẻ quan trọng"
                      >
                        <Sparkles className="h-3.5 w-3.5 fill-current text-current" />
                      </button>
                    </div>

                    {/* Term Title */}
                    <div className="text-center py-6">
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-medium text-white tracking-tight leading-relaxed group-hover:text-cyan-300 transition-colors">
                        {currentCard.front}
                      </h3>
                      <p className="text-xs text-slate-400 mt-3 font-medium opacity-85">Bấm vào đây để lật mặt xem định nghĩa học máy chi tiết</p>
                    </div>

                    {/* Bottom Status metadata */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-4 text-[11px] text-slate-400">
                      <span>Dự án: Machine Learning Edu</span>
                      <span className="font-mono bg-slate-900 border border-white/10 px-2 py-0.5 rounded text-cyan-455">Card ID: #0{currentCard.id}</span>
                    </div>

                  </div>

                  {/* BACK SIDE */}
                  <div className="absolute inset-0 w-full h-full rounded-3xl bg-[#1e293b] border border-cyan-500/35 p-6 sm:p-8 text-white shadow-2xl transition-all flex flex-col justify-between rotate-y-180 backface-hidden select-none">
                    
                    {/* Upper decorative elements */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 bg-emerald-400 rounded-full"></span>
                        <span className="text-xs font-mono tracking-wider text-emerald-400 font-semibold uppercase">Mặt sau • Định nghĩa</span>
                      </div>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900/60 text-cyan-300 border border-white/10">
                        {currentCard.category}
                      </span>
                    </div>

                    {/* Definition Content */}
                    <div className="py-2 text-center sm:px-4">
                      <p className="text-base sm:text-lg md:text-xl font-normal text-slate-100 leading-relaxed font-sans mt-1">
                        {currentCard.back}
                      </p>
                    </div>

                    {/* Bottom Indicator */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-4 text-[11px] text-slate-300">
                      <span className="opacity-80">Bấm lại để lật hướng ban đầu</span>
                      <span className="font-mono bg-slate-950/70 text-cyan-300 px-2 py-0.5 rounded border border-white/10">Card #0{currentCard.id}</span>
                    </div>

                  </div>

                </div>
              </div>
            </div>

            {/* PROGRESS TRACKER */}
            <div className="max-w-md mx-auto space-y-1" id="flashcard-progress">
              <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
                <span>Tiến trình hoàn thành thẻ</span>
                <span className="text-cyan-400">{Math.round(((currentCardIndex + 1) / totalCards) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-800 border border-white/5 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-cyan-500 h-1.5 rounded-full transition-all duration-300 ease-out shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                  style={{ width: `${((currentCardIndex + 1) / totalCards) * 100}%` }}
                ></div>
              </div>
              {/* Dot Indicators */}
              <div className="flex justify-center gap-1.5 pt-3">
                {FLASHCARDS_DATA.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsFlipped(false);
                      setCurrentCardIndex(idx);
                    }}
                    className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${
                      currentCardIndex === idx 
                        ? "w-6 bg-cyan-400 shadow-sm shadow-cyan-400/30" 
                        : "w-2 bg-slate-700 hover:bg-slate-500"
                    }`}
                    title={`Chuyển đến thẻ ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* ACTION FOOTER BAR */}
            <div className="flex justify-center items-center gap-4 pt-2">
              <button
                id="btn-prev-card"
                onClick={handlePrevCard}
                className="flex items-center gap-2 bg-slate-800 text-slate-200 hover:text-white border border-white/10 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-750 transition-all hover:border-cyan-500/20 shadow-xs cursor-pointer active:scale-95"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Quay lại</span>
              </button>
              
              <button
                id="btn-flip-card"
                onClick={() => setIsFlipped(prev => !prev)}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-cyan-500/20 whitespace-nowrap active:scale-95"
              >
                Lật mặt thẻ
              </button>

              <button
                id="btn-next-card"
                onClick={handleNextCard}
                className="flex items-center gap-2 bg-slate-800 text-slate-200 hover:text-white border border-white/10 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-750 transition-all hover:border-cyan-500/20 shadow-xs cursor-pointer active:scale-95"
              >
                <span>Tiếp theo</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Study tips box using dark glassmorphism */}
            <div className="max-w-xl mx-auto bg-slate-900/50 p-4 rounded-xl border border-white/10 text-slate-300 text-xs flex gap-3">
              <Info className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-white">Phương pháp học tập qua thẻ phản xạ (Flashcard Method):</p>
                <p className="leading-relaxed opacity-90">
                  Bạn có thể tự nhẩm đáp án trong đầu khi nhìn từ khóa, sau đó lật mặt để kiểm tra. Hãy đánh dấu mục tiêu bằng nút sao ở mặt trước để lưu ý các khái niệm phức tạp như kỹ thuật cân bằng lớp <span className="text-cyan-400 font-semibold">SMOTE</span> hoặc cấu trúc Boosting của mô hình <span className="text-cyan-400 font-semibold">XGBoost</span>.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* TAB CONTENT: QUIZ */}
        {currentPath === "/multiple-choice" && (
          <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]" id="quiz-tab-view">
            <span id="quiz-top"></span>

            {/* QUIZ SCORE BANNER IN IMMERSIVE DARK MODE */}
            {isSubmitted && (
              <div className="max-w-3xl mx-auto bg-[#1e293b] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-[bounceIn_0.6s_ease-out] relative" id="quiz-result-card">
                
                {/* Visual Accent */}
                <div className={`h-2.5 w-full ${
                  quizScore >= 8 
                    ? "bg-emerald-500" 
                    : quizScore >= 5 
                      ? "bg-amber-500" 
                      : "bg-rose-500"
                }`}></div>

                <div className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  
                  {/* Left Side: Score Display */}
                  <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                    <div className={`h-20 w-20 sm:h-24 sm:w-24 rounded-full flex flex-col items-center justify-center border-4 text-white font-display font-bold shadow-md shrink-0 ${
                      quizScore >= 8 
                        ? "border-emerald-500 bg-emerald-950/40 text-emerald-400" 
                        : quizScore >= 5 
                          ? "border-amber-500 bg-amber-950/40 text-amber-400" 
                          : "border-rose-500 bg-rose-950/40 text-rose-400"
                    }`}>
                      <span className="text-2xl sm:text-3xl tracking-tight leading-none">{quizScore}</span>
                      <span className="text-[11px] border-t border-white/10 mt-1 pt-1 opacity-80">/ {QUIZ_DATA.length}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="text-base sm:text-lg font-bold text-white">
                          {quizScore >= 8 
                            ? "Xuất sắc! Bạn làm rất tốt" 
                            : quizScore >= 5 
                              ? "Khá tốt! Hãy tiếp tục ôn luyện" 
                              : "Đừng nản chí! Hãy xem lại kiến thức"}
                        </span>
                        <Sparkles className="h-4 w-4 text-amber-450 animate-pulse" />
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed opacity-95">
                        Bạn đạt tỷ lệ chính xác <strong className="text-cyan-400">{Math.round((quizScore / QUIZ_DATA.length) * 100)}%</strong>. 
                        Các câu hỏi đều dựa trên nghiên cứu thực nghiệm thực tế về mô hình hóa hiệu quả học tập.
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Re-actions custom styles */}
                  <div className="w-full md:w-auto flex flex-col gap-2 shrink-0">
                    <button
                      id="btn-restart-quiz"
                      onClick={handleResetQuiz}
                      className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-3 rounded-xl text-sm font-bold transition-all shadow-md shadow-cyan-500/10 cursor-pointer active:scale-95"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Làm lại bài thi</span>
                    </button>
                    <button
                      onClick={() => {
                        navigateTo("/flashcard");
                        setCurrentCardIndex(0);
                      }}
                      className="flex items-center justify-center gap-2 bg-slate-905 hover:bg-slate-800 text-slate-200 border border-white/10 px-5 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer"
                    >
                      <Layers className="h-4 w-4 text-cyan-400" />
                      <span>Ôn tập lại Flashcard</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* WARNING / INCOMPLETE ALERTS IN AMBER GOLD DESIGN */}
            {showIncompleteAlert && (
              <div className="max-w-3xl mx-auto bg-amber-950/30 text-amber-300 p-4 rounded-xl border border-amber-500/20 text-xs sm:text-sm flex gap-3 animate-pulse" id="incomplete-alert">
                <HelpCircle className="h-5 w-5 text-amber-400 shrink-0" />
                <div>
                  <span className="font-semibold">Bạn chưa hoàn thành bài thi!</span>
                  <span className="opacity-90"> Vui lòng chọn đáp án cho tất cả <strong>10 câu hỏi</strong> trước khi gửi nộp kết quả. Hệ thống đã xác định vị trí câu hỏi chưa trả lời giúp bạn.</span>
                </div>
              </div>
            )}

            {/* QUESTIONS CONTAINER WITH TRANSPARENT CARDS */}
            <div className="max-w-3xl mx-auto space-y-6" id="questions-list">
              {QUIZ_DATA.map((q, qIndex) => {
                const userSelected = selectedAnswers[q.id];
                const isCorrect = userSelected === q.correctAnswer;
                
                return (
                  <div 
                    key={q.id} 
                    id={`question-${q.id}`}
                    className={`border p-5 sm:p-6 rounded-2xl transition-all duration-200 bg-slate-850/40 backdrop-blur-xs ${
                      isSubmitted 
                        ? isCorrect 
                          ? "border-emerald-500/40 shadow-sm shadow-emerald-950/20 bg-emerald-950/10" 
                          : "border-rose-500/40 shadow-sm shadow-rose-950/20 bg-rose-950/10"
                        : "border-white/10 hover:border-cyan-500/20 shadow-xs"
                    }`}
                  >
                    
                    {/* Question Header */}
                    <div className="flex items-start gap-3">
                      
                      {/* Number badge inside dark metal boxes */}
                      <span className={`h-7 w-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        isSubmitted 
                          ? isCorrect 
                            ? "bg-emerald-500/25 text-emerald-300 border border-emerald-500/20" 
                            : "bg-rose-500/25 text-rose-300 border border-rose-500/20"
                          : "bg-slate-900 text-slate-300 border border-white/10"
                      }`}>
                        {qIndex + 1}
                      </span>

                      {/* Question Text */}
                      <div className="space-y-1">
                        <h4 className="text-sm sm:text-base font-semibold text-white leading-relaxed font-sans">
                          {q.question}
                        </h4>
                        
                        {/* Interactive Status Indicator for Question */}
                        <div className="flex gap-2 items-center text-xs">
                          {isSubmitted ? (
                            isCorrect ? (
                              <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Chính xác
                              </span>
                            ) : (
                              <span className="text-rose-400 font-semibold flex items-center gap-1 text-[11px]">
                                <XCircle className="h-3.5 w-3.5" /> Chưa đúng
                              </span>
                            )
                          ) : userSelected ? (
                            <span className="text-cyan-400 font-medium font-mono text-[11px]"> Đã chọn đáp án {userSelected}</span>
                          ) : (
                            <span className="text-slate-500 text-[11px]"> ❖ Vui lòng chọn một đáp án</span>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* OPTIONS GRID */}
                    <div className="mt-5 grid grid-cols-1 gap-2.5 pl-0 sm:pl-10">
                      {q.options.map(opt => {
                        const isOptSelected = userSelected === opt.key;
                        const isOptCorrect = opt.key === q.correctAnswer;
                        
                        // Màu sắc hiển thị dựa trên trạng thái nộp bài (Immersive slate format)
                        let optionStyle = "border-white/10 bg-[#161d2d]/60 hover:border-cyan-500/30 hover:bg-slate-800/50 text-slate-300 hover:text-white";
                        
                        if (isSubmitted) {
                          if (isOptCorrect) {
                            // Tô xanh đáp án đúng
                            optionStyle = "bg-emerald-950/45 border-emerald-500/50 text-emerald-100 font-medium shadow-xs shadow-emerald-500/10";
                          } else if (isOptSelected && !isCorrect) {
                            // Tô đỏ đáp án sai khi người dùng chọn sai
                            optionStyle = "bg-rose-950/45 border-rose-500/50 text-rose-100 font-medium shadow-xs shadow-rose-500/10";
                          } else {
                            // Muted options
                            optionStyle = "border-white/5 bg-slate-950/20 text-slate-550 opacity-40";
                          }
                        } else if (isOptSelected) {
                          // Khi người dùng chọn (Chưa submit)
                          optionStyle = "bg-cyan-950/30 border-cyan-500/55 text-cyan-300 font-semibold ring-1 ring-cyan-500/15 shadow-sm shadow-cyan-500/10";
                        }

                        return (
                          <button
                            key={opt.key}
                            id={`q-${q.id}-opt-${opt.key}`}
                            disabled={isSubmitted}
                            onClick={() => handleSelectOption(q.id, opt.key)}
                            className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between text-xs sm:text-sm transition-all duration-150 ${
                              isSubmitted ? "" : "cursor-pointer active:translate-x-1"
                            } ${optionStyle}`}
                          >
                            <div className="flex items-center gap-3">
                              
                              {/* Option Key Badge */}
                              <span className={`h-5 w-5 rounded text-[11px] font-mono font-bold flex items-center justify-center shrink-0 ${
                                isSubmitted 
                                  ? isOptCorrect 
                                    ? "bg-emerald-600 text-white" 
                                    : isOptSelected 
                                      ? "bg-rose-600 text-white" 
                                      : "bg-slate-800 text-slate-500"
                                  : isOptSelected 
                                    ? "bg-cyan-500 text-slate-950" 
                                    : "bg-slate-900 text-slate-400 group-hover:bg-slate-800 border border-white/5"
                              }`}>
                                {opt.key}
                              </span>

                              <span className="leading-relaxed">{opt.text}</span>
                            </div>

                            {/* Validation icons */}
                            <div>
                              {isSubmitted ? (
                                isOptCorrect ? (
                                  <Check className="h-4.5 w-4.5 text-emerald-100 bg-emerald-600 rounded-full p-0.5 shrink-0" />
                                ) : isOptSelected ? (
                                  <span className="text-rose-300 text-[11px] bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-500/20 shrink-0 font-medium">Bạn chọn</span>
                                ) : null
                              ) : isOptSelected ? (
                                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shrink-0"></span>
                              ) : null}
                            </div>

                          </button>
                        );
                      })}
                    </div>

                    {/* COLLAPSIBLE DETAILED EXPLANATION */}
                    {isSubmitted && (
                      <div className="mt-4 pl-0 sm:pl-10 animate-[fadeIn_0.5s_ease-out]">
                        <div className="bg-slate-900/60 border border-cyan-500/10 rounded-xl p-4 text-xs text-slate-300 space-y-1.5">
                          <p className="font-semibold text-cyan-405 flex items-center gap-1.5 uppercase font-mono tracking-wider text-[10px]">
                            <HelpCircle className="h-3.5 w-3.5 text-cyan-500" /> Giải thích học thuật:
                          </p>
                          <p className="leading-relaxed font-sans opacity-95">{q.explanation}</p>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

            {/* SUBMIT BUTTON CONTROL BAR */}
            <div className="flex flex-col items-center gap-4 pt-4">
              {!isSubmitted ? (
                <button
                  id="btn-submit-quiz"
                  onClick={handleSubmitQuiz}
                  className="w-full max-w-sm bg-cyan-500 hover:bg-cyan-400 text-slate-950 py-4 rounded-2xl font-bold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer text-center text-sm active:scale-98 tracking-wider uppercase"
                >
                  Nộp Bài Thi & Chấm Điểm
                </button>
              ) : (
                <button
                  id="btn-footer-restart-quiz"
                  onClick={handleResetQuiz}
                  className="flex items-center gap-2 bg-slate-800 text-slate-200 hover:text-white border border-white/10 hover:border-cyan-500/20 px-8 py-3.5 rounded-2xl text-sm font-semibold hover:bg-slate-750 transition-all shadow-md cursor-pointer active:scale-95"
                >
                  <RotateCcw className="h-4 w-4 text-cyan-400" />
                  <span>Bắt đầu lại bộ câu hỏi</span>
                </button>
              )}
              
              <div className="text-slate-500 text-xs text-center font-mono py-2">
                Tổng số câu hỏi: 10 / Trạng thái bắt buộc chọn tất cả đáp án
              </div>
            </div>

          </div>
        )}

      </main>

      {/* COMPACT ACADEMIC FOOTER */}
      <footer className="border-t border-white/10 bg-slate-950/50 py-8 px-4 mt-16 text-xs text-slate-400 text-center space-y-3" id="main-footer">
        <p className="max-w-2xl mx-auto leading-relaxed">
          Sản phẩm này là một công cụ hỗ trợ giáo dục phi lợi nhuận thuộc dự án nghiên cứu <strong className="text-cyan-400 font-semibold">&quot;Dự đoán sớm kết quả học tập của sinh viên thông qua các thuật toán cân bằng và mô hình Boosting&quot;</strong>.
        </p>
        <div className="flex justify-center gap-6 text-slate-500">
          <span>Hỗ trợ tuyển sinh & đào tạo hiệu quả</span>
          <span>•</span>
          <span>Nghiên cứu khoa học dữ liệu giáo dục</span>
        </div>
        <p className="text-[10px] text-slate-500 font-mono">
          &copy; 2026 Dự án Máy Học Sớm. Thiết kế UI tinh chuẩn bởi Front-end Developer.
        </p>
      </footer>
    </div>
  );
}


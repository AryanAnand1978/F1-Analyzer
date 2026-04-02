import { useState, useRef, useEffect } from "react";
import "../css/chatbot.css";

// Simple response cache to avoid repeated API calls
const responseCache = new Map();

// F1-related keywords for validation
const F1_KEYWORDS = [
  "f1", "formula", "driver", "team", "race", "circuit", "pit", "lap",
  "podium", "championship", "constructor", "qualifying", "grid", "dnf",
  "ferrari", "mercedes", "red bull", "mclaren", "alpine", "aston martin",
  "williams", "haas", "alfa romeo", "alphatauri", "racing bulls", "audi",
  "hamilton", "verstappen", "leclerc", "sainz", "norris", "perez", "russell",
  "alonso", "stroll", "ocon", "gasly", "bottas", "zhou", "magnussen", "hulkenberg",
  "tsunoda", "ricciardo", "sargeant", "piastri", "lawson", "bearman",
  "points", "wins", "season", "grand prix", "gp", "monaco", "spa", "monza",
  "silverstone", "bahrain", "jeddah", "melbourne", "imola", "barcelona",
  "tyre", "tire", "strategy", "overtake", "drs", "kers", "engine", "power unit"
];

// Direct stat patterns that don't need AI
const DIRECT_STAT_PATTERNS = [
  /how many (wins|points|podiums|races)/i,
  /(\w+) (wins|points|podiums) in (\d{4})/i,
  /total (wins|points|podiums)/i,
  /what (is|are|was|were) .* (points|wins|podiums)/i,
  /^(wins|points|podiums|position|standings)/i
];

// Analytical patterns that need AI
const ANALYTICAL_PATTERNS = [
  /why (did|was|is|were|has)/i,
  /explain/i,
  /analyze/i,
  /compare .* (performance|better|worse)/i,
  /what (caused|led to|happened)/i,
  /how (come|did .* manage|could)/i,
  /(better|worse|best|worst) .* (and why|because)/i,
  /insight/i,
  /predict/i,
  /opinion/i
];

function Chatbot({ seasonData, driversData, teamsData }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hi! I'm your F1 Analyst. Ask me about drivers, teams, or race statistics!"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const debounceRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check if question is F1-related
  const isF1Related = (question) => {
    const lowerQ = question.toLowerCase();
    return F1_KEYWORDS.some(keyword => lowerQ.includes(keyword));
  };

  // Classify question type
  const classifyQuestion = (question) => {
    const lowerQ = question.toLowerCase();
    
    // Check for direct stat questions
    if (DIRECT_STAT_PATTERNS.some(pattern => pattern.test(lowerQ))) {
      return "direct";
    }
    
    // Check for analytical questions
    if (ANALYTICAL_PATTERNS.some(pattern => pattern.test(lowerQ))) {
      return "analytical";
    }
    
    // Default to hybrid for conditional/scenario questions
    return "hybrid";
  };

  // Extract relevant data based on question
  const extractRelevantData = (question) => {
    const lowerQ = question.toLowerCase();
    let relevantData = {};

    // Extract season year if mentioned
    const yearMatch = question.match(/\b(19[5-9]\d|20[0-2]\d)\b/);
    if (yearMatch) {
      relevantData.season = yearMatch[1];
    }

    // Extract team names
    const teamNames = [
      "ferrari", "mercedes", "red bull", "red_bull", "mclaren", "alpine",
      "aston martin", "aston_martin", "williams", "haas", "alfa romeo",
      "alphatauri", "racing bulls", "audi", "sauber"
    ];
    
    const mentionedTeams = teamNames.filter(team => 
      lowerQ.includes(team.replace("_", " "))
    );
    
    if (mentionedTeams.length > 0 && teamsData) {
      relevantData.teams = teamsData.filter(t => 
        mentionedTeams.some(mt => 
          t.name?.toLowerCase().includes(mt) || 
          t.id?.toLowerCase().includes(mt.replace(" ", "_"))
        )
      );
    }

    // Extract driver names
    const driverKeywords = [
      "hamilton", "verstappen", "leclerc", "sainz", "norris", "perez",
      "russell", "alonso", "stroll", "ocon", "gasly", "bottas", "zhou",
      "magnussen", "hulkenberg", "tsunoda", "ricciardo", "piastri", "lawson"
    ];
    
    const mentionedDrivers = driverKeywords.filter(d => lowerQ.includes(d));
    
    if (mentionedDrivers.length > 0 && driversData) {
      relevantData.drivers = driversData.filter(d =>
        mentionedDrivers.some(md => 
          d.name?.toLowerCase().includes(md) ||
          d.id?.toLowerCase().includes(md)
        )
      );
    }

    // Include season data if relevant
    if (seasonData && (lowerQ.includes("race") || lowerQ.includes("season"))) {
      relevantData.seasonStats = {
        totalRaces: seasonData.length,
        season: relevantData.season || new Date().getFullYear()
      };
    }

    return relevantData;
  };

  // Answer direct stat questions locally
  const answerDirectQuestion = (question, data) => {
    const lowerQ = question.toLowerCase();
    
    // Team points
    if (data.teams && data.teams.length > 0) {
      const team = data.teams[0];
      
      if (lowerQ.includes("point")) {
        return `${team.name} has ${team.points} points${data.season ? ` in ${data.season}` : ""}.`;
      }
      if (lowerQ.includes("win")) {
        return `${team.name} has ${team.wins} wins${data.season ? ` in ${data.season}` : ""}.`;
      }
      if (lowerQ.includes("position") || lowerQ.includes("standing")) {
        return `${team.name} is in P${team.position} in the standings with ${team.points} points.`;
      }
    }
    
    // Driver stats
    if (data.drivers && data.drivers.length > 0) {
      const driver = data.drivers[0];
      
      if (lowerQ.includes("point")) {
        return `${driver.name} has ${driver.points} points${data.season ? ` in ${data.season}` : ""}.`;
      }
      if (lowerQ.includes("win")) {
        return `${driver.name} has ${driver.wins} wins${data.season ? ` in ${data.season}` : ""}.`;
      }
      if (lowerQ.includes("position") || lowerQ.includes("standing")) {
        return `${driver.name} is P${driver.position} with ${driver.points} points and ${driver.wins} wins.`;
      }
      if (lowerQ.includes("team")) {
        return `${driver.name} drives for ${driver.team}.`;
      }
    }

    return null; // Couldn't answer directly
  };

  // Build context for AI call
  const buildContext = (question, data) => {
    let contextParts = ["You are an F1 analyst. Answer briefly in 2-3 sentences max."];
    
    if (data.teams && data.teams.length > 0) {
      data.teams.forEach(team => {
        contextParts.push(`\nTeam: ${team.name}`);
        contextParts.push(`Position: P${team.position}`);
        contextParts.push(`Points: ${team.points}`);
        contextParts.push(`Wins: ${team.wins}`);
      });
    }
    
    if (data.drivers && data.drivers.length > 0) {
      data.drivers.forEach(driver => {
        contextParts.push(`\nDriver: ${driver.name}`);
        contextParts.push(`Team: ${driver.team}`);
        contextParts.push(`Position: P${driver.position}`);
        contextParts.push(`Points: ${driver.points}`);
        contextParts.push(`Wins: ${driver.wins}`);
      });
    }
    
    if (data.season) {
      contextParts.push(`\nSeason: ${data.season}`);
    }
    
    contextParts.push(`\nQuestion: ${question}`);
    contextParts.push("\nAnswer concisely:");
    
    return contextParts.join("\n");
  };

  // Call backend API
  const callAI = async (prompt) => {
    // Check cache first
    const cacheKey = prompt.toLowerCase().trim();
    if (responseCache.has(cacheKey)) {
      return responseCache.get(cacheKey);
    }

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      
      if (!response.ok) {
        throw new Error("API call failed");
      }
      
      const data = await response.json();
      const result = data.response || "Sorry, I couldn't process that.";
      
      // Cache the response
      responseCache.set(cacheKey, result);
      
      // Limit cache size
      if (responseCache.size > 50) {
        const firstKey = responseCache.keys().next().value;
        responseCache.delete(firstKey);
      }
      
      return result;
    } catch (error) {
      console.error("Chat API error:", error);
      return "Sorry, I'm having trouble connecting. Please try again.";
    }
  };

  // Handle message submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;

    // Clear any pending debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Add user message
    const userMessage = { role: "user", content: trimmedInput };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Debounce the actual processing
    debounceRef.current = setTimeout(async () => {
      let response;

      // Check if F1-related
      if (!isF1Related(trimmedInput)) {
        response = "🏎️ I can only answer F1-related questions. Try asking about drivers, teams, races, or statistics!";
      } else {
        const questionType = classifyQuestion(trimmedInput);
        const relevantData = extractRelevantData(trimmedInput);

        if (questionType === "direct") {
          // Try to answer locally
          const directAnswer = answerDirectQuestion(trimmedInput, relevantData);
          if (directAnswer) {
            response = directAnswer;
          } else {
            // Fall back to AI if local answer failed
            const context = buildContext(trimmedInput, relevantData);
            response = await callAI(context);
          }
        } else {
          // Analytical or hybrid - use AI with context
          const context = buildContext(trimmedInput, relevantData);
          response = await callAI(context);
        }
      }

      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setLoading(false);
    }, 300); // 300ms debounce
  };

  // Quick suggestion buttons
  const suggestions = [
    "Driver standings",
    "Team comparison",
    "Who has most wins?",
    "Championship leader"
  ];

  const handleSuggestion = (suggestion) => {
    setInput(suggestion);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <span className="chatbot-icon">🏎️</span>
        <h3>F1 Analyst</h3>
      </div>

      <div className="chatbot-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-content">
              {msg.content}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="message assistant">
            <div className="message-content loading">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-suggestions">
        {suggestions.map((suggestion, idx) => (
          <button
            key={idx}
            className="suggestion-btn"
            onClick={() => handleSuggestion(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="chatbot-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about F1 stats..."
          className="chatbot-input"
          disabled={loading}
        />
        <button 
          type="submit" 
          className="chatbot-send"
          disabled={loading || !input.trim()}
        >
          ➤
        </button>
      </form>
    </div>
  );
}

export default Chatbot;

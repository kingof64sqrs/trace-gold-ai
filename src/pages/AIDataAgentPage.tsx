import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, AlertTriangle, Info, Send, XCircle } from "lucide-react";

const briefings = [
  { severity: "critical", title: "CFTC Part 17 Gap Detected", text: "2 position records in today's large trader report cannot be traced to a confirmed source trade in CME Globex. This creates a potential regulatory reporting gap. Recommend immediate validation of TradeID CME-TX-20241203-88421 and CME-TX-20241203-88439 before the 9pm CT submission deadline.", color: "border-cme-red bg-cme-red/5" },
  { severity: "high", title: "BrokerTec Schema Drift", text: "The U.S. Treasury repo rate feed (BrokerTec Stream 2.0) introduced a new field 'RepoMaturityBucket' in today's 6am data drop. This field is not currently mapped in the settlement price calculation pipeline. Three downstream outputs may be receiving null values.", color: "border-cme-amber bg-cme-amber/5" },
  { severity: "high", title: "Google Cloud Migration Lineage Gap", text: "The CME Clearing margin engine pipeline was registered on the Google Cloud Unified Data Platform at 04:17 CT today. However, 4 data assets within this pipeline have not yet been mapped to their on-premises predecessors.", color: "border-cme-amber bg-cme-amber/5" },
  { severity: "info", title: "Revenue Attribution Updated", text: "Interest rate ADV for today is tracking at 38.2 million contracts, 12% above the FY2025 daily average. The revenue attribution model has automatically updated downstream fee calculations. Snowflake analytics views have been refreshed with the latest cross-platform data.", color: "border-cme-blue bg-cme-blue/5" },
];

const suggestedPrompts = [
  "Trace the E-mini S&P 500 settlement price to its CFTC report",
  "What feeds the clearing and transaction fee revenue line?",
  "Show all assets affected by BrokerTec schema change",
  "Which assets are not yet mapped in Google Cloud migration?",
  "Generate a CFTC Part 17 audit summary for today",
  "What is the impact if the SOFR feed goes down?",
];

const sevIcons: Record<string, typeof AlertTriangle> = {
  critical: XCircle,
  high: AlertTriangle,
  info: Info,
};

const sevColors: Record<string, string> = {
  critical: "text-cme-red",
  high: "text-cme-amber",
  info: "text-cme-blue",
};

interface Message {
  role: "user" | "assistant";
  content: string;
}

const mockResponses: Record<string, string> = {
  default: `Based on CME Group's current data lineage analysis:

**E-mini S&P 500 (ES) Settlement Price Lineage:**

1. **Source:** CME Globex MDP 3.0 Feed — captures all ES order flow and executions in real-time
2. **Matching:** CME Globex Trade Matching Engine processes 26.5M contracts/day average
3. **Calculation:** Settlement Price Engine applies VWAP methodology per CME Rule 813
4. **Validation:** Automated cross-check against Snowflake historical benchmarks
5. **Propagation:** Settlement price feeds 23 downstream consumers including:
   - \`CFTC Part 17 Large Trader Report\` — position valuation
   - \`FCM Segregation Report\` — margin calculations
   - \`Market Data Revenue Feed\` — $710M revenue stream

⚠️ **Current Alert:** The BrokerTec schema change does NOT affect ES settlement, but the CFTC Part 17 gap (2 missing position records) may delay today's submission.

**Regulatory Status:** CFTC Part 17 submission is 94% complete, due 9:00 PM CT.`,
};

const AIDataAgentPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    const userMsg: Message = { role: "user", content: msg };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "assistant", content: mockResponses.default }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-full flex animate-fade-in">
      {/* Left: Briefings */}
      <div className="w-96 border-r border-border bg-card overflow-y-auto">
        <div className="p-3 border-b border-border flex items-center gap-2">
          <Brain className="w-4 h-4 text-cme-purple" />
          <span className="text-[10px] uppercase tracking-wider font-semibold text-cme-purple">AI Proactive Briefing</span>
        </div>
        <div className="p-3 space-y-3">
          {briefings.map((item, i) => {
            const Icon = sevIcons[item.severity];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`border-l-2 rounded p-3 ${item.color}`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon className={`w-3.5 h-3.5 ${sevColors[item.severity]}`} />
                  <span className={`text-[10px] uppercase tracking-wider font-semibold ${sevColors[item.severity]}`}>{item.severity}</span>
                </div>
                <h4 className="text-[11px] font-semibold text-foreground mb-1">{item.title}</h4>
                <p className="text-[10px] text-secondary-foreground leading-relaxed">{item.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Right: Chat */}
      <div className="flex-1 flex flex-col">
        <div className="p-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Brain className="w-4 h-4 text-cme-purple" />
            CME Data Intelligence Agent
          </h2>
          <p className="text-[10px] text-muted-foreground mt-0.5">Ask about data lineage, regulatory compliance, revenue tracing, or impact analysis</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Brain className="w-10 h-10 text-cme-purple/30" />
              <p className="text-[11px] text-muted-foreground">Select a prompt below or type your question</p>
              <div className="flex flex-wrap gap-2 max-w-lg justify-center">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="text-[10px] px-3 py-1.5 rounded-full border border-cme-purple/30 text-cme-purple hover:bg-cme-purple/10 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-lg rounded-lg px-4 py-3 ${
                msg.role === "user"
                  ? "bg-cme-blue/20 border border-cme-blue/30"
                  : "bg-card border border-cme-purple/20"
              }`}>
                <pre className="text-[11px] text-secondary-foreground whitespace-pre-wrap font-sans leading-relaxed">{msg.content}</pre>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-card border border-cme-purple/20 rounded-lg px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-cme-purple/50 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-border">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about CME data lineage, compliance, or revenue..."
              className="flex-1 bg-secondary text-[11px] text-foreground rounded px-3 py-2 outline-none placeholder:text-muted-foreground border border-border focus:border-cme-purple/50 transition-colors"
            />
            <button onClick={() => handleSend()} className="px-3 py-2 rounded bg-cme-purple/20 text-cme-purple border border-cme-purple/30 hover:bg-cme-purple/30 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDataAgentPage;

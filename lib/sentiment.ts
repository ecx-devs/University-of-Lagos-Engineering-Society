export type SentimentCategory = 'positive' | 'suggestion' | 'urgent' | 'neutral';

export type TopicCategory =
  | 'Academics & Faculty'
  | 'Facilities & Classrooms'
  | 'Welfare & Dues'
  | 'Events & Competitions'
  | 'Platform & Website'
  | 'General Inquiries';

export interface FeedbackSentimentResult {
  sentiment: SentimentCategory;
  sentimentLabel: string;
  sentimentColor: string;
  badgeBg: string;
  badgeText: string;
  topic: TopicCategory;
  score: number;
  urgency: 'low' | 'medium' | 'high';
}

const POSITIVE_KEYWORDS = [
  'thank', 'thanks', 'great', 'excellent', 'amazing', 'good', 'love', 'awesome',
  'helpful', 'appreciate', 'kudos', 'impressive', 'proud', 'wonderful', 'congrats',
  'congratulations', 'best', 'superb', 'enjoyed', 'commend', 'satisfied'
];

const SUGGESTION_KEYWORDS = [
  'suggest', 'suggestion', 'propose', 'proposal', 'recommend', 'could we',
  'would like', 'how about', 'idea', 'request', 'feature', 'improve', 'improvement',
  'consider', 'please add', 'hope to see', 'possible to', 'option'
];

const URGENT_KEYWORDS = [
  'urgent', 'broken', 'not working', 'fail', 'failed', 'error', 'bug', 'critical',
  'terrible', 'worst', 'unacceptable', 'fix immediately', 'complaint', 'harass',
  'scam', 'unfair', 'missing', 'delay', 'danger', 'hazard', 'emergency', 'distressed'
];

const TOPIC_PATTERNS: Record<TopicCategory, string[]> = {
  'Academics & Faculty': [
    'exam', 'test', 'lecture', 'lecturer', 'prof', 'professor', 'course', 'grade',
    'grades', 'result', 'results', 'cgpa', 'curriculum', 'syllabus', 'assignment',
    'lab', 'attendance', 'timetable', 'calendar', 'class test'
  ],
  'Facilities & Classrooms': [
    'hall', 'classroom', 'auditorium', 'ac', 'air condition', 'fan', 'light', 'power',
    'generator', 'water', 'toilet', 'restroom', 'seat', 'bench', 'projector', 'sound',
    'speaker', 'mic', 'hostel', 'lab equipment', 'library'
  ],
  'Welfare & Dues': [
    'due', 'dues', 'fee', 'fees', 'receipt', 'payment', 'money', 'refund', 'bus',
    'shuttle', 'cab', 'food', 'feeding', 'cafeteria', 'welfare', 'health', 'clinic',
    'security', 'package', 'merch', 'shirt'
  ],
  'Events & Competitions': [
    'dinner', 'awards', 'award', 'dinner & awards', 'symposium', 'conference', 'pidec',
    'sports', 'football', 'hackathon', 'competition', 'gala', 'fresher', 'orientation',
    'engineering week', 'party', 'social'
  ],
  'Platform & Website': [
    'website', 'portal', 'web', 'link', 'page', 'dashboard', 'login', 'account',
    'signup', 'password', 'mobile', 'browser', 'ui', 'interface', 'download',
    'form', 'feedback form'
  ],
  'General Inquiries': []
};


export function analyzeFeedbackItem(subject: string, message: string): FeedbackSentimentResult {
  const combined = `${subject || ''} ${message || ''}`.toLowerCase();

  let posCount = 0;
  for (const kw of POSITIVE_KEYWORDS) {
    if (combined.includes(kw)) posCount += 1;
  }

  let sugCount = 0;
  for (const kw of SUGGESTION_KEYWORDS) {
    if (combined.includes(kw)) sugCount += 1;
  }

  let urgCount = 0;
  for (const kw of URGENT_KEYWORDS) {
    if (combined.includes(kw)) urgCount += 1;
  }


  let score = 0;
  if (posCount + urgCount + sugCount > 0) {
    score = (posCount - urgCount * 1.5) / (posCount + urgCount + sugCount);
  }


  let sentiment: SentimentCategory = 'neutral';
  let urgency: 'low' | 'medium' | 'high' = 'low';

  if (urgCount >= 1 && urgCount >= posCount) {
    sentiment = 'urgent';
    urgency = urgCount >= 2 ? 'high' : 'medium';
  } else if (sugCount >= 1 && sugCount >= posCount) {
    sentiment = 'suggestion';
    urgency = 'medium';
  } else if (posCount >= 1 && posCount > urgCount) {
    sentiment = 'positive';
    urgency = 'low';
  }


  let selectedTopic: TopicCategory = 'General Inquiries';
  let maxTopicHits = 0;

  for (const [topic, keywords] of Object.entries(TOPIC_PATTERNS) as [TopicCategory, string[]][]) {
    let hits = 0;
    for (const kw of keywords) {
      if (combined.includes(kw)) hits += 1;
    }
    if (hits > maxTopicHits) {
      maxTopicHits = hits;
      selectedTopic = topic;
    }
  }

  const badgeProps: Record<SentimentCategory, { label: string; color: string; bg: string; text: string }> = {
    positive: {
      label: 'Positive / Commendation',
      color: '#106333',
      bg: 'bg-emerald-50 border-emerald-200',
      text: 'text-emerald-800'
    },
    suggestion: {
      label: 'Constructive Suggestion',
      color: '#C85B15',
      bg: 'bg-amber-50 border-amber-200',
      text: 'text-amber-800'
    },
    urgent: {
      label: 'Needs Attention / Issue',
      color: '#DC2626',
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800'
    },
    neutral: {
      label: 'General Feedback',
      color: '#6B7280',
      bg: 'bg-gray-50 border-gray-200',
      text: 'text-gray-700'
    }
  };

  const meta = badgeProps[sentiment];

  return {
    sentiment,
    sentimentLabel: meta.label,
    sentimentColor: meta.color,
    badgeBg: meta.bg,
    badgeText: meta.text,
    topic: selectedTopic,
    score: Math.max(-1, Math.min(1, score)),
    urgency
  };
}

export interface SentimentOverviewSummary {
  total: number;
  positiveCount: number;
  suggestionCount: number;
  urgentCount: number;
  neutralCount: number;
  positivePct: number;
  suggestionPct: number;
  urgentPct: number;
  neutralPct: number;
  healthScore: number;
  topTopics: Array<{ topic: TopicCategory; count: number; pct: number }>;
}


export function aggregateFeedbacksSummary(feedbacks: Array<{ subject: string; message: string }>): SentimentOverviewSummary {
  const total = feedbacks.length;
  if (total === 0) {
    return {
      total: 0,
      positiveCount: 0,
      suggestionCount: 0,
      urgentCount: 0,
      neutralCount: 0,
      positivePct: 0,
      suggestionPct: 0,
      urgentPct: 0,
      neutralPct: 0,
      healthScore: 100,
      topTopics: []
    };
  }

  let pos = 0;
  let sug = 0;
  let urg = 0;
  let neu = 0;

  const topicCounts: Record<TopicCategory, number> = {
    'Academics & Faculty': 0,
    'Facilities & Classrooms': 0,
    'Welfare & Dues': 0,
    'Events & Competitions': 0,
    'Platform & Website': 0,
    'General Inquiries': 0
  };

  for (const fb of feedbacks) {
    const analysis = analyzeFeedbackItem(fb.subject, fb.message);
    if (analysis.sentiment === 'positive') pos += 1;
    else if (analysis.sentiment === 'suggestion') sug += 1;
    else if (analysis.sentiment === 'urgent') urg += 1;
    else neu += 1;

    topicCounts[analysis.topic] = (topicCounts[analysis.topic] || 0) + 1;
  }

  const positivePct = Math.round((pos / total) * 100);
  const suggestionPct = Math.round((sug / total) * 100);
  const urgentPct = Math.round((urg / total) * 100);
  const neutralPct = Math.max(0, 100 - (positivePct + suggestionPct + urgentPct));


  const healthScore = Math.min(100, Math.max(10, Math.round(70 + (pos * 15 - urg * 25) / total)));

  const topTopics = Object.entries(topicCounts)
    .map(([topic, count]) => ({
      topic: topic as TopicCategory,
      count,
      pct: Math.round((count / total) * 100)
    }))
    .filter(t => t.count > 0)
    .sort((a, b) => b.count - a.count);

  return {
    total,
    positiveCount: pos,
    suggestionCount: sug,
    urgentCount: urg,
    neutralCount: neu,
    positivePct,
    suggestionPct,
    urgentPct,
    neutralPct,
    healthScore,
    topTopics
  };
}

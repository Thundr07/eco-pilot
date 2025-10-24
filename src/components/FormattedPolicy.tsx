import { useState } from 'react';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { ChevronDown } from 'lucide-react';
import { Button } from './ui/button';

interface FormattedPolicyProps {
  raw: string;
}

const FormattedPolicy = ({ raw }: FormattedPolicyProps) => {
  if (!raw || raw.trim() === '') {
    return <p className="text-muted-foreground text-sm">No content available.</p>;
  }

  // Try to parse as JSON first
  if (raw.trim().startsWith('{') || raw.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(raw);
      return <StructuredContent data={parsed} />;
    } catch (e) {
      // Not valid JSON, continue with text parsing
    }
  }

  const sections = parseText(raw);
  
  return (
    <div className="space-y-4">
      {sections.map((section, idx) => (
        <Section key={idx} section={section} />
      ))}
    </div>
  );
};

// Parse raw text into structured sections
const parseText = (text: string) => {
  const lines = text.split('\n');
  const sections: any[] = [];
  let currentSection: any = null;
  let currentList: any[] = [];
  let listType: 'ul' | 'ol' | null = null;

  const flushList = () => {
    if (currentList.length > 0 && currentSection) {
      currentSection.content.push({ type: listType, items: currentList });
      currentList = [];
      listType = null;
    }
  };

  const flushSection = () => {
    if (currentSection) {
      flushList();
      sections.push(currentSection);
      currentSection = null;
    }
  };

  for (let line of lines) {
    const trimmed = line.trim();
    
    // Detect headings
    if (trimmed.startsWith('###')) {
      flushSection();
      currentSection = { type: 'section', heading: trimmed.replace(/^###\s*/, ''), level: 4, content: [] };
    } else if (trimmed.startsWith('##')) {
      flushSection();
      currentSection = { type: 'section', heading: trimmed.replace(/^##\s*/, ''), level: 3, content: [] };
    } else if (trimmed.startsWith('#')) {
      flushSection();
      currentSection = { type: 'section', heading: trimmed.replace(/^#\s*/, ''), level: 2, content: [] };
    }
    // Detect policy blocks (e.g., "POLICY 1:", "Policy 1 -")
    else if (/^POLICY\s+\d+:?/i.test(trimmed) || /^Policy\s+\d+\s*[-:]/.test(trimmed)) {
      flushList();
      if (!currentSection) {
        currentSection = { type: 'section', heading: 'Policies', level: 3, content: [] };
      }
      currentSection.content.push({ type: 'policy', text: line });
    }
    // Detect lists
    else if (/^[-*•]\s/.test(trimmed)) {
      if (listType !== 'ul') {
        flushList();
        listType = 'ul';
      }
      currentList.push(trimmed.replace(/^[-*•]\s*/, ''));
    } else if (/^\d+\.\s/.test(trimmed)) {
      if (listType !== 'ol') {
        flushList();
        listType = 'ol';
      }
      currentList.push(trimmed.replace(/^\d+\.\s*/, ''));
    }
    // Empty line (paragraph break)
    else if (trimmed === '') {
      flushList();
    }
    // Regular paragraph
    else if (trimmed.length > 0) {
      flushList();
      if (!currentSection) {
        currentSection = { type: 'section', heading: '', level: 0, content: [] };
      }
      currentSection.content.push({ type: 'paragraph', text: line });
    }
  }

  flushSection();
  return sections;
};

// Render a section
const Section = ({ section }: { section: any }) => {
  const [expanded, setExpanded] = useState(true);
  const wordCount = JSON.stringify(section.content).split(/\s+/).length;
  const isLong = wordCount > 300;

  const HeadingTag = section.level === 2 ? 'h2' : section.level === 3 ? 'h3' : 'h4';
  
  return (
    <Card className="bg-card/50 border border-border/50">
      <CardContent className="p-4">
        {section.heading && (
          <div className="flex items-center justify-between mb-3">
            <HeadingTag className={`font-semibold ${section.level === 2 ? 'text-xl' : section.level === 3 ? 'text-lg' : 'text-base'}`}>
              {section.heading}
            </HeadingTag>
            {isLong && (
              <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
                <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
              </Button>
            )}
          </div>
        )}
        <div className={`space-y-3 ${!expanded && isLong ? 'max-h-40 overflow-hidden' : ''}`}>
          {section.content.map((item: any, idx: number) => (
            <ContentItem key={idx} item={item} />
          ))}
        </div>
        {!expanded && isLong && (
          <Button variant="link" size="sm" className="mt-2 p-0 h-auto" onClick={() => setExpanded(true)}>
            Read more
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// Render individual content items
const ContentItem = ({ item }: { item: any }) => {
  if (item.type === 'paragraph') {
    return <p className="text-sm text-foreground/90 leading-relaxed">{highlightNumbers(item.text)}</p>;
  }
  
  if (item.type === 'policy') {
    return (
      <div className="bg-accent/30 border-l-4 border-primary p-3 rounded-r">
        <p className="text-sm font-medium">{highlightNumbers(item.text)}</p>
      </div>
    );
  }
  
  if (item.type === 'ul') {
    return (
      <ul className="list-disc list-inside space-y-1 text-sm text-foreground/90 ml-2">
        {item.items.map((li: string, i: number) => (
          <li key={i} className="leading-relaxed">{highlightNumbers(li)}</li>
        ))}
      </ul>
    );
  }
  
  if (item.type === 'ol') {
    return (
      <ol className="list-decimal list-inside space-y-1 text-sm text-foreground/90 ml-2">
        {item.items.map((li: string, i: number) => (
          <li key={i} className="leading-relaxed">{highlightNumbers(li)}</li>
        ))}
      </ol>
    );
  }
  
  return null;
};

// Highlight numeric tokens
const highlightNumbers = (text: string) => {
  const parts = text.split(/(\d+(?:\.\d+)?%|\d+(?:\.\d+)?\s*(?:INR|Rs|₹|tons?|years?|kWh|MW|km|m²|ha|lakh|crore))/gi);
  return (
    <>
      {parts.map((part, i) => {
        if (/\d/.test(part)) {
          return (
            <Badge key={i} variant="secondary" className="mx-1 text-xs font-semibold bg-yellow-500/20 text-yellow-700 dark:text-yellow-300">
              {part}
            </Badge>
          );
        }
        return part;
      })}
    </>
  );
};

// Render structured JSON data
const StructuredContent = ({ data }: { data: any }) => {
  if (Array.isArray(data)) {
    return (
      <div className="space-y-3">
        {data.map((item, idx) => (
          <Card key={idx} className="bg-card/50">
            <CardContent className="p-4">
              <pre className="text-xs text-foreground/80 whitespace-pre-wrap">{JSON.stringify(item, null, 2)}</pre>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (data.summary) {
    return (
      <div className="space-y-4">
        <Card className="bg-accent/10">
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2">Summary</h3>
            <p className="text-sm text-foreground/90">{data.summary}</p>
          </CardContent>
        </Card>
        {data.policies && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Policies</h3>
            {data.policies.map((policy: any, idx: number) => (
              <Card key={idx} className="bg-card/50">
                <CardContent className="p-4">
                  <p className="text-sm font-medium">{policy.title || `Policy ${idx + 1}`}</p>
                  <p className="text-sm text-muted-foreground mt-1">{policy.description || policy}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {data.insights && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Insights</h3>
            {data.insights.map((insight: string, idx: number) => (
              <p key={idx} className="text-sm text-foreground/90">{insight}</p>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className="bg-card/50">
      <CardContent className="p-4">
        <pre className="text-xs text-foreground/80 whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
      </CardContent>
    </Card>
  );
};

export default FormattedPolicy;

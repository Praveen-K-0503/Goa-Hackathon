// Builder Title Generator
// Deterministic fun title based on role/stack keywords

const titleMap = [
  { keywords: ['ai', 'ml', 'machine learning', 'deep learning', 'llm', 'gpt', 'neural'],
    titles: ['Neural Forge Master', 'AI Whisperer', 'Model Architect', 'Prompt Engineer Supreme', 'Silicon Mind Bender'] },
  { keywords: ['blockchain', 'solidity', 'web3', 'defi', 'nft', 'crypto', 'ethereum', 'solana', 'chain'],
    titles: ['Chain Whisperer', 'Token Architect', 'DeFi Sorcerer', 'On-Chain Alchemist', 'Block Weaver'] },
  { keywords: ['design', 'ui', 'ux', 'figma', 'pixel', 'graphic', 'visual'],
    titles: ['Pixel Alchemist', 'UI Summoner', 'Visual Hacker', 'Design Oracle', 'Interface Wizard'] },
  { keywords: ['backend', 'api', 'node', 'python', 'java', 'go', 'rust', 'database', 'server'],
    titles: ['API Conjurer', 'Data Pipeline Wizard', 'Server-Side Sage', 'Backend Shaman', 'System Architect'] },
  { keywords: ['frontend', 'react', 'vue', 'angular', 'css', 'html', 'javascript', 'typescript'],
    titles: ['Component Craftsman', 'DOM Bender', 'UX Sorcerer', 'State Machine Sage', 'UI Hacker'] },
  { keywords: ['devops', 'docker', 'kubernetes', 'k8s', 'aws', 'cloud', 'ci', 'cd', 'infra'],
    titles: ['Cloud Nomad', 'Infrastructure Titan', 'Pipeline Prophet', 'DevOps Oracle', 'Container Commander'] },
  { keywords: ['founder', 'ceo', 'product', 'pm', 'manager', 'startup'],
    titles: ['Startup Alchemist', 'Vision Hacker', 'Product Oracle', 'Ecosystem Builder', 'Ship-It CEO'] },
  { keywords: ['marketing', 'growth', 'content', 'social', 'community'],
    titles: ['Growth Hacker', 'Vibe Architect', 'Community Weaver', 'Narrative Engineer', 'Alpha Caller'] },
  { keywords: ['fullstack', 'full stack', 'full-stack', 'mern', 'mean'],
    titles: ['Vibe Coder Supreme', 'Full Stack Shaman', 'Ship-It Engineer', 'Code Alchemist', 'Stack Bender'] },
  { keywords: ['data', 'analytics', 'science', 'scientist', 'sql', 'pandas'],
    titles: ['Data Alchemist', 'Insight Oracle', 'Pattern Seeker', 'Numbers Whisperer', 'Analytics Sage'] },
  { keywords: ['security', 'hacker', 'pen test', 'ctf', 'cyber'],
    titles: ['White Hat Oracle', 'Zero-Day Hunter', 'Security Sage', 'Exploit Architect', 'Cyber Shaman'] },
]

const defaultTitles = [
  'Builder #247', 'Goa Hacker', 'Code Nomad', 'Ship-It Builder',
  'Hackathon Legend', 'Idea Machine', 'Maker Supreme', 'Builder at Heart'
]

/**
 * Generate a builder title from role + stack
 * @param {string} role 
 * @param {string} stack 
 * @returns {string}
 */
export function generateBuilderTitle(role = '', stack = '') {
  const combined = `${role} ${stack}`.toLowerCase().trim()

  if (!combined) {
    return defaultTitles[Math.floor(Math.random() * defaultTitles.length)]
  }

  // Find matching category
  for (const category of titleMap) {
    if (category.keywords.some(kw => combined.includes(kw))) {
      const idx = combined.length % category.titles.length // deterministic
      return category.titles[idx]
    }
  }

  return defaultTitles[combined.length % defaultTitles.length]
}

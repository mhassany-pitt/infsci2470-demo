import * as d3 from 'd3';

export const randomNetwork = (n: number, l: number) => {
  const nodes = [
    "Leadership", "Communication", "Problem-solving", "Time management", "Adaptability", "Teamwork",
    "Project management", "Critical thinking", "Attention to detail", "Decision making",
    "Interpersonal skills", "Technical skills", "Creativity", "Analytical skills", "Conflict resolution",
    "Presentation skills", "Negotiation", "Strategic planning", "Sales skills", "Customer service",
    "Marketing", "Financial management", "Risk management", "Research skills", "Multitasking",
    "Innovation", "Collaboration", "Organizational skills", "Networking", "Public speaking",
    "Change management", "Quality control", "Human resources management",
    "Coaching and mentoring", "Attention to detail", "Problem-solving", "Digital literacy",
    "Data management", "Business intelligence", "Cross-cultural communication", "Process improvement",
    "Language proficiency", "Conflict resolution", "Diversity and inclusion", "Instructional design",
    "Social media management", "Emotional intelligence", "Cybersecurity", "Entrepreneurship",
    "Supply chain management",
  ].sort(() => .5 - Math.random()).slice(0, n);

  return d3.range(l).map(v => ({
    source: nodes[Math.round(Math.random() * nodes.length)],
    target: nodes[Math.round(Math.random() * nodes.length)],
    type: Math.random() > .5 ? "physical" : "cognitive"
  }))
}
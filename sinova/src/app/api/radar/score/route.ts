// Live Radar scoring endpoint — lets you tweak 3 dimensions and see the
// composite + level recompute in real-time. Used by the Radar demo page.
import { NextRequest, NextResponse } from 'next/server';
import { score, type RadarInput } from '@/lib/radar';

export async function POST(req: NextRequest) {
  const { scoreHistory, scoreBenchmark, scoreReg } = await req.json() as RadarInput;
  const clamp = (n: number) => Math.max(0, Math.min(100, Number(n) || 0));
  return NextResponse.json(score({
    scoreHistory:   clamp(scoreHistory),
    scoreBenchmark: clamp(scoreBenchmark),
    scoreReg:       clamp(scoreReg),
  }));
}

export async function GET() {
  return NextResponse.json({
    description: '3-dimension Radar scoring engine — see doc §2.2.6',
    weights: { history: 0.4, benchmark: 0.3, regulatory: 0.3 },
    levels: {
      HEALTHY:  '80-100 · 无需干预',
      WATCH:    '60-79  · 90 天 · 邮件提醒 + AI 建议',
      ALERT:    '40-59  · 60 天 · SMS + 工作台高亮',
      CRITICAL: '0-39   · 30 天 · 电话 + AI Partner 接管',
    },
  });
}

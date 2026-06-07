import React from 'react';
import { Composition } from 'remotion';
import { MasterTemplate, getTotalDuration } from './MasterTemplate';

// Sample data for preview
const FIX_DATA = {
  videoType: 'fix',
  title: 'Cursor Indexing Stuck',
  problem: 'يتجمد Cursor عند فهرسة المشروع ولا يستجيب لأي أوامر.',
  cause: 'ملف .cursorignore غير موجود مما يسبب فهرسة node_modules بالكامل.',
  solution: [
    { title: 'أنشئ ملف .cursorignore', detail: 'في جذر المشروع', code: 'touch .cursorignore' },
    { title: 'أضف المجلدات الكبيرة', detail: 'node_modules, .git, dist, build' },
    { title: 'أعد تشغيل Cursor', detail: 'Cmd+Shift+P → Reload Window' },
  ],
  cta: { text: 'تابعني للمزيد من نصائح AI Dev!', handle: '@aidevtips', emoji: '⚡' },
};

const COMPARISON_DATA = {
  videoType: 'comparison',
  toolA: 'Cursor',
  toolB: 'Windsurf',
  features: [
    { label: 'السعر', a: '$20/شهر', b: '$15/شهر' },
    { label: 'الذكاء', a: 'GPT-4 + Claude', b: 'Claude فقط' },
    { label: 'السرعة', a: '⭐⭐⭐⭐', b: '⭐⭐⭐⭐⭐' },
  ],
  pros: {
    Cursor: ['تكامل Git أفضل', 'Composer متقدم'],
    Windsurf: ['أسرع', 'أرخص', 'واجهة أنظف'],
  },
  cons: {
    Cursor: ['أغلى', 'استهلاك RAM أعلى'],
    Windsurf: ['ميزات أقل', 'لا يدعم multi-model'],
  },
  winner: 'Cursor',
  winnerReason: 'للمشاريع الكبيرة والفرق — Cursor يفوز بفارق كبير.',
  cta: { text: 'أي أداة تستخدم؟ أخبرني في التعليقات!', handle: '@aidevtips', emoji: '🏆' },
};

const WORKFLOW_DATA = {
  videoType: 'workflow',
  workflowName: 'AI Blog Workflow',
  steps: [
    { name: 'Idea Input',   icon: '💡', detail: 'إدخال الفكرة من Notion', tool: 'n8n Trigger', outputs: ['عنوان المقال', 'الكلمات المفتاحية'] },
    { name: 'AI Research',  icon: '🔍', detail: 'جمع المعلومات تلقائياً', tool: 'Perplexity API', inputs: ['عنوان المقال'], outputs: ['ملخص البحث'] },
    { name: 'Draft Writer', icon: '✍️', detail: 'كتابة المسودة بـ Claude', tool: 'Claude API', inputs: ['ملخص البحث'], outputs: ['مسودة المقال'] },
    { name: 'Publish',      icon: '🚀', detail: 'نشر على WordPress', tool: 'WordPress API', inputs: ['مسودة المقال'] },
  ],
  cta: { text: 'هل تريد الـ template كاملاً؟', handle: '@aidevtips', emoji: '🤖' },
};

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="FixVideo"
        component={MasterTemplate}
        durationInFrames={getTotalDuration(FIX_DATA)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoData: FIX_DATA }}
      />
      <Composition
        id="ComparisonVideo"
        component={MasterTemplate}
        durationInFrames={getTotalDuration(COMPARISON_DATA)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoData: COMPARISON_DATA }}
      />
      <Composition
        id="WorkflowVideo"
        component={MasterTemplate}
        durationInFrames={getTotalDuration(WORKFLOW_DATA)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoData: WORKFLOW_DATA }}
      />
    </>
  );
};

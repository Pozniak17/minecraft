import type { FaqArticleContentBlock, FaqArticleListBlock } from './joinArticleContent';

export type { FaqArticleContentBlock, FaqArticleListBlock };

export type FaqSectionContent = {
  id: string;
  tocNum: string;
  tocLabel: string;
  title: string;
  titleDesktop?: string;
  lead: FaqArticleContentBlock;
  bullets?: FaqArticleListBlock;
  steps?: FaqArticleListBlock;
  callout?: {
    variant: 'info' | 'success';
    title: string;
    titleDesktop?: string;
    text: FaqArticleContentBlock;
  };
  figure?: {
    src: string;
    alt: string;
    caption?: string;
    desktopOnly?: boolean;
  };
  troubleItems?: {
    mobile: readonly { title: string; text: string }[];
    desktop: readonly { title: string; text: string }[];
  };
  showIpBox?: boolean;
};

export type FaqArticleFullContent = {
  lead: FaqArticleContentBlock;
  sections: readonly FaqSectionContent[];
  sidebarRelatedSlugs: readonly string[];
  feedback: {
    hint: FaqArticleContentBlock;
    yes: FaqArticleContentBlock;
    no: FaqArticleContentBlock;
    stats: FaqArticleContentBlock;
  };
  cta?: {
    primary: string;
    primaryHref: string;
    secondary: string;
    secondaryHref: string;
  };
};

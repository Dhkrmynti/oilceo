import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DEMO, demoWell, demoPond, demoRounds, demoStatus, usePoll, type Well, type Pond, type RoundRow, type Status } from "./lib/api";
import { dropMeeting, useFeed } from "./lib/feed";
import { prefersReducedMotion } from "./lib/motion";
import { restoreWallet } from "./lib/wallet";
import { Agenda, Closing, TopBar } from "./sections/Frame";
import { Hero } from "./sections/Hero";
import { Briefing, Chyron } from "./sections/Story";
import { Board } from "./sections/Board";
import { Embargo, Minutes, Reserve } from "./sections/Reserve";
import { BadgeDrawer, CredentialsSection } from "./sections/Credentials";
import { MarkBanner, MeetingSiren, PumpToast, ShareCard, useBarrelFromLink } from "./ui/ShareCard";

gsap.registerPlugin(ScrollTrigger);

/**
 * The page is one working day at the Barrel House: the office, the morning briefing, the summit at
 * the round table, the Oil Reserve out back, the minutes, the embargo list, the accreditation desk,
 * and the office after hours. Every place has its own ground; the edges between them are drawn.
 */
export function App() {
  const { data: status, error } = usePoll<Status>("/api/status", 4000, demoStatus);
  const live = !!status?.tokenAddress;
  const { data: pond } = usePoll<Pond>(live ? "/api/pond?limit=50" : null, 3000, demoPond);
  const { data: well } = usePoll<Well>(live ? "/api/forest" : null, 3000, demoWell);
  const { data: rounds } = usePoll<RoundRow[]>(live ? "/api/rounds" : null, 20000, demoRounds);
  const feed = useFeed(pond, rounds, well, live);

  useEffect(restoreWallet, []);
  useBarrelFromLink(live, well?.total ?? 5000);

  // The illustration edition has no real rounds: when its reserve tops out and starts over, the
  // siren plays the meeting that would have happened.
  const lastReserve = useRef(0);
  useEffect(() => {
    if (!DEMO || !status) return;
    const r = parseFloat(status.escrowETH);
    if (r < lastReserve.current - 0.01) dropMeeting({ eth: 0.02, n: status.rounds + 1 });
    lastReserve.current = r;
  }, [status]);

  // Scenes measure where they start once; when fonts or live rows change the height above them,
  // measure again so nothing starts in the wrong place.
  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });
    let t = 0;
    const again = () => {
      clearTimeout(t);
      t = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    document.fonts?.ready.then(again);
    window.addEventListener("load", again);
    const heights = new Map<Element, number>();
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const h = Math.round(e.contentRect.height);
        if (heights.get(e.target) !== h) {
          heights.set(e.target, h);
          again();
        }
      }
    });
    document.querySelectorAll(".place").forEach((el) => ro.observe(el));
    return () => {
      clearTimeout(t);
      window.removeEventListener("load", again);
      ro.disconnect();
    };
  }, []);

  // Leaving the office: as the first screen scrolls away the camera pushes in on the barrel and the
  // readouts lift off, so the next thing you see is the news running under it.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 } });
      tl.to(".hero__scene", { scale: 1.25, yPercent: 8, transformOrigin: "50% 45%", ease: "none" }, 0)
        .to(".hero__scene", { opacity: 0.3, ease: "power1.in" }, 0)
        .to(".hero__copy", { y: -100, opacity: 0, ease: "power1.in" }, 0)
        .to(".meter, .wire", { y: -40, opacity: 0, ease: "none" }, 0);
      gsap.from(".hero__h, .hero__sub, .hero__acts", { y: 30, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, delay: 0.1 });
      gsap.from(".office .pole", { scaleY: 0, transformOrigin: "50% 100%", duration: 0.7, ease: "back.out(1.6)", stagger: 0.05, delay: 0.3 });
      gsap.from(".office .ceo", { y: 60, opacity: 0, duration: 0.9, ease: "back.out(1.4)", delay: 0.5 });
      // the bar slides away while you walk down and comes back the moment you scroll up
      ScrollTrigger.create({
        start: 240,
        end: "max",
        onUpdate: (s) => gsap.to(".bar", { yPercent: s.direction === 1 ? -110 : 0, duration: 0.35, ease: "power2.out", overwrite: true }),
        onLeaveBack: () => gsap.to(".bar", { yPercent: 0, duration: 0.35, overwrite: true }),
      });
      gsap.fromTo(".progress", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
    });
    return () => ctx.revert();
  }, []);

  // Smooth scroll that ScrollTrigger reads from; off for reduced motion.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    const anchors = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a || a.getAttribute("href") === "#") return;
      const el = document.querySelector(a.getAttribute("href")!);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: a.getAttribute("href") === "#top" ? 0 : -20 });
    };
    document.addEventListener("click", anchors);
    return () => {
      document.removeEventListener("click", anchors);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="site">
      <TopBar status={status} />
      <span className="progress" aria-hidden="true" />
      <Agenda />
      {error && !status ? <p className="offline num">The wire is down for a moment.</p> : null}
      <Hero status={status} pond={pond} well={well} feed={feed} />
      <Chyron well={well} live={live} />
      <main>
        <Briefing status={status} well={well} />
        <Board status={status} pond={pond} />
        <Reserve status={status} />
        <Minutes rounds={rounds} live={live} status={status} house={pond?.house} />
        <Embargo status={status} />
        <CredentialsSection pond={pond} live={live} />
      </main>
      <Closing status={status} well={live ? well : null} ceoAddr={live && pond?.house ? pond.house.addr : undefined} />
      <BadgeDrawer />
      <ShareCard />
      <PumpToast well={live ? well : null} />
      <MarkBanner well={live ? well : null} />
      <MeetingSiren board={live ? (pond?.rows ?? []).filter((r) => r.inTop) : []} />
    </div>
  );
}

<script setup lang="ts">
import TestPanelUI from '@/features/reaction-test/test-panel/ui/index.vue'
import LaunchHistoryUI from '@/features/reaction-test/launch-history/ui/index.vue'
import GradingUI from '@/features/reaction-test/grading-action/ui/index.vue'
import FaqUI from '@/features/reaction-test/faq-section/ui/index.vue'
import ShareResultUI from '@/features/share-reaction-result/ui/index.vue'
import ChallengeBannerUI from '@/features/share-reaction-result/ui/challenge-banner.vue'
import ChallengeOutcomeUI from '@/features/share-reaction-result/ui/challenge-outcome.vue'
</script>

<template>
  <div class="flex flex-col gap-11 bg-[#0A0A0B] pt-11 pb-18">
    <TestPanelUI>
      <template #banner>
        <ChallengeBannerUI />
      </template>
      <template #summary="{ result }">
        <ChallengeOutcomeUI :average="result.average" />
      </template>
      <template #actions="{ result }">
        <ShareResultUI :result="result" />
      </template>
    </TestPanelUI>
    <LaunchHistoryUI />
    <GradingUI />
    <FaqUI />
  </div>
</template>

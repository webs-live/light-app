<script setup lang="ts">
  import { Dialog } from 'vant';
  import { useAgreement } from '@/views/agreement';

  const { showAgreement, handleCancel, handleConfirm, handleOpenPrivacy, handleOpenUser } =
    useAgreement();
</script>
<template>
  <Dialog
    v-model:show="showAgreement"
    title="软件许可及服务协议与隐私政策"
    show-cancel-button
    cancel
    confirm-button-text="我接受"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <div class="px-6 py-3 tracking-wider leading-normal indent-8 text-sm text-slate-500">
      请您在使用本产品之前仔细阅读
      <span style="color: #1989fa" @click="handleOpenUser"> 《用户协议》 </span>
      和
      <span style="color: #1989fa" @click="handleOpenPrivacy"> 《隐私协议》 </span>
      ,我们一向尊重并会严格保护用户在使用本产品时的合法权益（包括用户隐私、用户数据等）不受到任何侵犯。本协议（包括本文最后部分的隐私政策）是用户（包括通过各种合法途径获取到本产品的自然人、法人或其他组织机构，以下简称“用户”或“您”）与我们之间针对本产品相关事项最终的、完整的且排他的协议，并取代、合并之前的当事人之间关于上述事项的讨论和协议。本协议将对用户使用本产品的行为产生法律约束力，您已承诺和保证有权利和能力订立本协议。用户开始使用本产品将视为已经接受本协议，请认真阅读并理解本协议中各种条款，包括免除和限制我们的免责条款和对用户的权利限制（未成年人审阅时应由法定监护人陪同），如果您不能接受本协议中的全部条款，请勿开始使用本产品
    </div>
  </Dialog>
</template>

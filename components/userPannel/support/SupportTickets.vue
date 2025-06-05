<template>
  <div class="tickets">
    <SingleTicket
      v-for="ticket in tickets"
      :key="ticket.id"
      :ticket="ticket"
      @show-details="togglePopUp"
    />
    <transition name="fade">
      <BaseModal v-if="selectedTicket" @click.self="closeModal">
        <TicketPopUp
          v-if="selectedTicket"
          :ticket="selectedTicket"
          @close="selectedTicket = null"
        />
      </BaseModal>
    </transition>
  </div>
</template>

<script setup lang="ts">
import type { Ticket } from "@/types/ticket";
// const tickets = ref<Ticket[]>([
//   {
//     id: 1,
//     title: "تیکت 1",
//     status: "پاسخ داده شده",
//     date: "1402/01/01 ",
//     time: "14:00:12",
//     description:
//       "توضیحات لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از  طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و  سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه  درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته  حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها  شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ  پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و  دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان  مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل  دنیای موجود طراحی اساسا مورد استفاده قرار گیرد. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از  طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و  سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه  درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته  حال و آینده، شناخت فراوان جامعه ه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان  مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل  دنیای موجود طراحی اساسا مورد استفاده قرار گیرد. ",
//     priority: "کم",
//     images: [
//       "/sampleSC/screen.png",
//       "/sampleSC/screen.png",
//       "/sampleSC/screen.png",
//     ],
//     reply: {
//       id: 1,
//       message: "سلام، در حال بررسی هستیم. به زودی پاسخ می‌دهیم.",
//       date: "1402/01/02",
//       time: "10:32:00",
//       sender: "پشتیبان",
//     },
//   },
//   {
//     id: 2,
//     title: "تیکت 2",
//     status: "درحال بررسی",
//     date: "1402/01/01 ",
//     time: "14:00:12",
//     description:
//       "توضیحات تیکتتیکت یکتتی کتتیکتتیکتتیکتتیکتتیکتتیکتتیکتتیکتتیکت",
//     priority: "کم",
//   },
//   {
//     id: 3,
//     title: "تیکت 3",
//     status: "بسته",
//     date: "1402/01/01 ",
//     time: "14:00:12",
//     description:
//       "توضیحات تیکتتیک تتیکتتیکتتیکتتیکت تیکتتیکتتیکتتیکتتیکتتیکتتیکت",
//     priority: "کم",
//   },
//   {
//     id: 4,
//     title: "تیکت 4",
//     status: "بسته",
//     date: "1402/01/01 ",
//     time: "14:00:12",
//     description:
//       "توضیحات تیکتتیک تتیکتتیکتتیکتتیکت تیکتتیکتتیکتتیکتتیکتتیکتتیکت",
//     priority: "کم",
//   },
// ]);
const ticket = defineProps<{
  tickets: Ticket[];
}>();
const selectedTicket = ref<Ticket | null>(null);

const togglePopUp = (ticket: Ticket) => {
  selectedTicket.value = ticket;
};
const closeModal = () => (selectedTicket.value = null);
</script>

<style scoped>
.tickets {
  width: 95%;
  margin: 0 auto;
  margin-top: 10px;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

@media (max-width: 767px) {
  .tickets {
    width: 100%;
    padding: 10px;
  }
}
</style>

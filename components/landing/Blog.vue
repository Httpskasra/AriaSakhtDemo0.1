<template>
  <div>
    <h2>وبلاگ</h2>
    <div class="container">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9 6L15 12L9 18" stroke="#ADADAD" stroke-width="2" />
      </svg>
      <div class="blog">
        <div class="text">
          <h4>موضوع</h4>
          <p>
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با
            استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در
            ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز،
            و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای
            زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و
            متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان
            رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد
            کرد،
            <span>ادامه...</span>
          </p>
          <div class="user">
            <svg
              width="24"
              height="24"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.00033 8.49998C5.88699 8.49998 4.16699 6.77998 4.16699 4.66665C4.16699 2.55331 5.88699 0.833313 8.00033 0.833313C10.1137 0.833313 11.8337 2.55331 11.8337 4.66665C11.8337 6.77998 10.1137 8.49998 8.00033 8.49998ZM8.00033 1.83331C6.44033 1.83331 5.16699 3.10665 5.16699 4.66665C5.16699 6.22665 6.44033 7.49998 8.00033 7.49998C9.56033 7.49998 10.8337 6.22665 10.8337 4.66665C10.8337 3.10665 9.56033 1.83331 8.00033 1.83331Z"
                fill="#57626D"
              />
              <path
                d="M13.7268 15.1667C13.4534 15.1667 13.2268 14.94 13.2268 14.6667C13.2268 12.3667 10.8801 10.5 8.0001 10.5C5.1201 10.5 2.77344 12.3667 2.77344 14.6667C2.77344 14.94 2.54677 15.1667 2.27344 15.1667C2.0001 15.1667 1.77344 14.94 1.77344 14.6667C1.77344 11.82 4.56677 9.5 8.0001 9.5C11.4334 9.5 14.2268 11.82 14.2268 14.6667C14.2268 14.94 14.0001 15.1667 13.7268 15.1667Z"
                fill="#57626D"
              />
            </svg>
            <span>نام کاربری</span>
          </div>
        </div>
        <div class="pic">
          <img src="../../assets/products/blog.png" alt="" />
        </div>
      </div>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M15 6L9 12L15 18" stroke="#ADADAD" stroke-width="2" />
      </svg>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
h2 {
  text-align: center;
}
.container {
  width: 85%;
  margin: auto;
  height: auto;
  padding: 25px;
  background-color: #fff;
  border-radius: 15px;
  position: relative;
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.blog {
  /* height: 100%; */
  flex-basis: 94%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.pic {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-basis: 40%;
}
.text h4 {
  position: relative;
  bottom: 15px;
  left: 25px;
}
.text p {
  line-height: 20px;
  width: 98%;
}
.user {
  position: relative;
  top: 15px;
  left: 25px;
}
.pic img {
  /* width: 261px; */
  width: 100%;
  height: 150px;
  border-radius: 12px;
}

/* --- Mobile Styles --- */
@media (max-width: 600px) {
  .container {
    width: 98vw;
    min-width: 0;
    max-width: 99vw;
    margin: 12px auto 0 auto;
    padding: 10px 2vw 18px 2vw;
    border-radius: 18px;
    height: auto;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    box-shadow: 0 2px 8px #0001;
    gap: 0;
  }
  .blog {
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    gap: 0;
  }
  .pic {
    width: 100%;
    margin-bottom: 10px;
    justify-content: center;
    align-items: center;
    order: -1;
  }
  .pic img {
    width: 95vw;
    max-width: 340px;
    min-width: 180px;
    height: 120px;
    object-fit: cover;
    border-radius: 16px;
    margin: 0 auto 8px auto;
    display: block;
  }
  .text {
    width: 100%;
    padding: 0 2vw;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .text h4 {
    font-size: 15px;
    font-weight: 700;
    margin: 0 0 6px 0;
    position: static;
    left: unset;
    bottom: unset;
  }
  .text p {
    font-size: 13px;
    line-height: 1.7;
    width: 100%;
    margin: 0 0 8px 0;
    text-align: right;
  }
  .user {
    position: static;
    top: unset;
    left: unset;
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: #888;
  }
  .user svg {
    width: 20px;
    height: 20px;
  }
  /* فلش‌های دو طرف */
  .container > svg {
    display: none;
  }
}
</style>
